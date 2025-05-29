# Real-Time Chat Application

A modern, real-time chat application built with Python WebSocket backend and React frontend, featuring private messaging, room-based chat, and robust security features.

## 🌟 Features

- **Real-time Communication**: Instant message delivery using WebSocket technology
- **Room-based Chat**: Create and join different chat rooms
- **Private Messaging**: Send direct messages to other users
- **User Management**: Track online users and handle user sessions
- **Security Features**:
  - CORS protection with configurable allowed origins
  - Rate limiting to prevent abuse
  - IP-based connection attempt tracking
  - Automatic ban system for excessive connection attempts
- **Robust Error Handling**: Graceful handling of disconnections and errors
- **Ping/Pong**: Connection health monitoring
- **System Messages**: Automatic notifications for user events

## 🛠️ Tech Stack

### Backend
- Python 3.8+
- `websockets` library for WebSocket server
- Asyncio for asynchronous operations
- Built-in logging system

### Frontend
- React
- WebSocket client
- Modern UI components

## ⚙️ Configuration

The server can be configured through environment variables:

```bash
PORT=10000  # WebSocket server port
ENVIRONMENT=production  # Set to 'production' for strict CORS
```

## 🚀 Getting Started

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python chatbot.py
```

The server will start on `ws://0.0.0.0:10000/ws` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔒 Security Features

- **CORS Protection**: Configurable allowed origins with wildcard support
- **Rate Limiting**: Maximum 20 connection attempts per 15 seconds
- **IP Banning**: Automatic temporary bans for excessive connection attempts
- **Connection Timeout**: 15-second timeout for initial connection setup
- **Message Size Limit**: 1MB maximum message size
- **Ping/Pong**: 20-second ping interval with 10-second timeout

## 📝 API Documentation

### WebSocket Protocol

The server uses the 'chat' subprotocol. All messages are JSON-formatted with the following structure:

```json
{
  "type": "connect|message|private|ping",
  "content": "message content",
  "username": "sender name",
  "room": "room name",
  "timestamp": "ISO timestamp"
}
```

### Message Types

1. **Connect**
```json
{
  "type": "connect",
  "username": "your_username"
}
```

2. **Chat Message**
```json
{
  "type": "message",
  "content": "Hello, world!",
  "room": "general"
}
```

3. **Private Message**
```json
{
  "type": "private",
  "to": "recipient_username",
  "content": "Private message"
}
```

4. **Ping**
```json
{
  "type": "ping"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Special thanks to the `websockets` library maintainers
