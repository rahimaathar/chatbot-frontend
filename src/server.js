const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.use(express.json());


const wss = new WebSocket.Server({ 
    server,
    verifyClient: (info, callback) => {
        callback(true);
    }
});


const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
       
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});


app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }


        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});


const clients = new Map();
const rooms = new Map();

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection from:', req.socket.remoteAddress);
    let username = null;
    let currentRoom = 'general';
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data.type);

            if (data.type === 'connect') {
                username = data.username;
                clients.set(ws, { username, currentRoom });

            
                if (!rooms.has('general')) {
                    rooms.set('general', new Set());
                }
                rooms.get('general').add(ws);

             
                broadcastToRoom('general', {
                    type: 'system',
                    content: `${username} has joined the chat`,
                    timestamp: new Date().toLocaleTimeString()
                });

              
                broadcastUserList();
            } else if (data.type === 'message' || data.type === 'media') {
                if (username) {
                    const message = {
                        type: data.type,
                        content: data.content,
                        sender: username,
                        timestamp: new Date().toLocaleTimeString(),
                        fileType: data.fileType,
                        fileName: data.fileName,
                        room: data.room || currentRoom
                    };

                   
                    if (data.type === 'media' && data.content) {
                        if (typeof data.content === 'string' && data.content.startsWith('data:')) {
                            message.content = data.content;
                        } else {
                            try {
                                const base64Data = data.content.toString('base64');
                                message.content = `data:${data.fileType};base64,${base64Data}`;
                            } catch (error) {
                                console.error('Error processing media content:', error);
                                message.content = data.content;
                            }
                        }
                    }

                    if (data.room) {
                        broadcastToRoom(data.room, message);
                    } else {
                        broadcastToRoom(currentRoom, message);
                    }
                }
            } else if (data.type === 'typing') {
                if (username) {
                    broadcastToRoom(currentRoom, {
                        type: 'typing',
                        user: username
                    });
                }
            } else if (data.type === 'stop_typing') {
                if (username) {
                    broadcastToRoom(currentRoom, {
                        type: 'stop_typing',
                        user: username
                    });
                }
            } else if (data.type === 'join_room') {
                if (username) {
                   
                    if (rooms.has(currentRoom)) {
                        rooms.get(currentRoom).delete(ws);
                    }

                    currentRoom = data.room;
                    if (!rooms.has(currentRoom)) {
                        rooms.set(currentRoom, new Set());
                    }
                    rooms.get(currentRoom).add(ws);
                    clients.set(ws, { username, currentRoom });

                    broadcastToRoom(currentRoom, {
                        type: 'system',
                        content: `${username} has joined the room`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'error',
                    content: 'Error processing message'
                }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected:', username);
        clearInterval(pingInterval);

        if (username) {
          
            if (rooms.has(currentRoom)) {
                rooms.get(currentRoom).delete(ws);
            }

         
            clients.delete(ws);

 
            broadcastToRoom(currentRoom, {
                type: 'system',
                content: `${username} has left the chat`,
                timestamp: new Date().toLocaleTimeString()
            });

 
            broadcastUserList();
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'error',
                content: 'Connection error occurred'
            }));
        }
    });
});

function broadcastToRoom(room, message) {
    if (rooms.has(room)) {
        rooms.get(room).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(JSON.stringify(message));
                } catch (error) {
                    console.error('Error broadcasting message:', error);
                }
            }
        });
    }
}

function broadcastUserList() {
    const userList = Array.from(clients.values()).map(client => client.username);
    const message = {
        type: 'user_list',
        users: userList
    };

    clients.forEach((client, ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(message));
            } catch (error) {
                console.error('Error sending user list:', error);
            }
        }
    });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server is ready at ws://localhost:${PORT}`);
}); 
