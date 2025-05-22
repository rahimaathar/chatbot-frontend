import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Box, Typography, Avatar, IconButton, Badge, Snackbar, Alert, Popover } from "@mui/material";
import { Send, Close, Notifications, NotificationsOff, Palette, EmojiEmotions, Mic, People, Logout } from "@mui/icons-material";
import { format } from "date-fns";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { websocketService } from "../services/websocket";
import { themes } from "../styles/themes";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import InputArea from "./InputArea";
import MediaSidebar from "./MediaSidebar";
import Sidebar from "./Sidebar";
import ConnectionScreen from "./ConnectionScreen";
import { bounce, pulse, fadeIn } from "../styles/animations";
import './chat.css';

// Constants
const MAX_MESSAGES = 50;
const PING_INTERVAL = 25000;
const TYPING_DEBOUNCE = 500;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

const Chat = () => {
  // State
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [privateMessages, setPrivateMessages] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [chatRooms, setChatRooms] = useState(["general"]);
  const [showMediaSidebar, setShowMediaSidebar] = useState(false);
  const [sharedMedia, setSharedMedia] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeAnchorEl, setThemeAnchorEl] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const inputRef = useRef(null);

  // Memoized values
  const currentMessages = useMemo(() => {
    return selectedUser
      ? privateMessages[selectedUser] || []
      : messages.filter(msg => msg.room === currentRoom);
  }, [selectedUser, privateMessages, messages, currentRoom]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u !== username);
  }, [users, username]);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    const statusSubscription = setInterval(() => {
      setConnectionStatus(websocketService.status);
    }, 1000);
    return () => clearInterval(statusSubscription);
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      console.log('Received message:', message);

      if (message.type === "clear") {
        setMessages([]);
        return;
      }

      // Only add message if it's from another user
      if (message.sender !== username) {
        setMessages(prev => [...prev.slice(-MAX_MESSAGES), message]);
      }

      if (soundEnabled && message.type === "message") {
        playSound("/ntf.wav");
      }
    };

    const handleUserList = (userList) => {
      console.log('Received user list:', userList);
      setUsers(userList);
      if (selectedUser && !userList.includes(selectedUser)) {
        setSelectedUser(null);
      }
    };

    const handlePrivateMessage = (message) => {
      console.log('Received private message:', message);
      const otherUser = message.sender === username ? message.to : message.sender;
      setPrivateMessages(prev => ({
        ...prev,
        [otherUser]: [...(prev[otherUser] || []).slice(-MAX_MESSAGES), message]
      }));
    };

    const handleTyping = (message) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        message.isTyping ? newSet.add(message.from) : newSet.delete(message.from);
        return newSet;
      });
    };

    const handleError = (error) => {
      console.error('WebSocket error:', error);
      setSnackbar({
        open: true,
        message: error.message || "Connection error",
        severity: "error"
      });
      attemptReconnect();
    };

    // Add event listeners and store unsubscribe functions
    const unsubscribers = [
      websocketService.on('message', handleMessage),
      websocketService.on('userList', handleUserList),
      websocketService.on('privateMessage', handlePrivateMessage),
      websocketService.on('typing', handleTyping),
      websocketService.on('error', handleError)
    ];

    // Cleanup function
    return () => {
      // Call all unsubscribe functions
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [username, selectedUser, soundEnabled]);

  // Helper functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Audio playback error:", e));
  };

  const attemptReconnect = () => {
    if (retryCountRef.current >= MAX_RECONNECT_ATTEMPTS) return;

    const delay = Math.min(RECONNECT_DELAY * Math.pow(2, retryCountRef.current), 30000);
    retryCountRef.current++;

    setTimeout(() => {
      if (username) {
        handleConnect().catch(() => attemptReconnect());
      }
    }, delay);
  };

  // Event handlers
  const handleConnect = async () => {
    if (!username.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a username",
        severity: "error"
      });
      return;
    }

    try {
      await websocketService.connect(username);
      setSnackbar({
        open: true,
        message: "Connected successfully!",
        severity: "success"
      });
      setIsConnected(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Connection failed: ${error.message}`,
        severity: "error"
      });
      throw error;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || connectionStatus !== 'connected') {
      console.log('Cannot send message:', { message, connectionStatus });
      return;
    }

    try {
      if (selectedUser) {
        websocketService.sendPrivateMessage(selectedUser, message);
      } else {
        websocketService.sendMessage(message, currentRoom);
      }

      // Add message to local state immediately
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        sender: username,
        timestamp: new Date().toISOString(),
        type: "message",
        room: currentRoom
      };

      setMessages(prev => [...prev.slice(-MAX_MESSAGES), newMessage]);
      setMessage("");
      playSound("/sent.wav");
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: `Failed to send message: ${error.message}`,
        severity: "error"
      });
    }
  };

  const handleTyping = useCallback(() => {
    if (!selectedUser || connectionStatus !== 'connected') return;

    clearTimeout(typingTimeoutRef.current);
    websocketService.sendTypingIndicator(selectedUser);

    typingTimeoutRef.current = setTimeout(() => {
      websocketService.sendTypingIndicator(selectedUser);
    }, TYPING_DEBOUNCE);
  }, [selectedUser, connectionStatus]);

  const handleUserSelect = (user) => {
    setSelectedUser(prev => prev === user ? null : user);
  };

  const handleRoomChange = (room) => {
    setCurrentRoom(room);
    setMessages([]);
  };

  const handleCreateRoom = () => {
    const roomName = prompt("Enter room name:");
    if (roomName && !chatRooms.includes(roomName)) {
      setChatRooms([...chatRooms, roomName]);
      setCurrentRoom(roomName);
    }
  };

  const handleLogout = () => {
    websocketService.disconnect();
    setUsername("");
    setMessages([]);
    setUsers([]);
    setPrivateMessages({});
    setIsConnected(false);
  };

  const handleThemeClick = (event) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme);
    handleThemeClose();
  };

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const onEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    handleEmojiClose();
  };

  const handleMediaShare = async (file) => {
    if (!file) return;

    try {
      if (file.type.startsWith('audio/')) {
        // Get audio duration
        const audioUrl = URL.createObjectURL(file);
        const audio = new Audio(audioUrl);

        const duration = await new Promise((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            URL.revokeObjectURL(audioUrl);
          });
          audio.addEventListener('error', () => {
            console.error('Error loading audio file');
            resolve('0:00');
            URL.revokeObjectURL(audioUrl);
          });
        });

        console.log('Audio duration:', duration); // Debug log

        // Handle voice message
        const message = {
          id: Date.now().toString(),
          type: 'voice',
          sender: username,
          timestamp: new Date().toISOString(),
          content: URL.createObjectURL(file),
          room: currentRoom,
          duration: duration
        };

        // Send to server
        const base64Content = await fileToBase64(file);
        websocketService.sendMessage(JSON.stringify({
          type: 'voice',
          content: base64Content,
          room: currentRoom,
          duration: duration
        }));

        // Add to local messages
        setMessages(prev => [...prev.slice(-MAX_MESSAGES), message]);
      } else {
        // Handle other media types
        setSnackbar({
          open: true,
          message: "Media sharing not implemented yet",
          severity: "info"
        });
      }
    } catch (error) {
      console.error('Error sharing media:', error);
      setSnackbar({
        open: true,
        message: "Failed to share media",
        severity: "error"
      });
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  if (!isConnected) {
    return (
      <Box className="login-container">
        <ConnectionScreen
          username={username}
          setUsername={setUsername}
          handleConnect={handleConnect}
          currentTheme={currentTheme}
          isLoading={connectionStatus === 'connecting'}
          error={connectionStatus === 'error' ? "Connection error" : null}
        />
      </Box>
    );
  }

  return (
    <Box className="chat-container">
      <Sidebar
        open={sidebarOpen}
        toggleOpen={() => setSidebarOpen(!sidebarOpen)}
        users={filteredUsers}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        rooms={chatRooms}
        currentRoom={currentRoom}
        onRoomChange={handleRoomChange}
        onCreateRoom={handleCreateRoom}
        theme={currentTheme}
      />
      <Box className="chat-area">
        <ChatHeader
          selectedUser={selectedUser}
          currentTheme={currentTheme}
          themes={themes}
          handleThemeClick={handleThemeClick}
          handleThemeClose={handleThemeClose}
          handleThemeSelect={handleThemeSelect}
          themeAnchorEl={themeAnchorEl}
          soundEnabled={soundEnabled}
          toggleSound={() => setSoundEnabled(!soundEnabled)}
          handleLogout={handleLogout}
          setShowMediaSidebar={setShowMediaSidebar}
          showMediaSidebar={showMediaSidebar}
        />
        <Box className="messages-container">
          {currentMessages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.sender === username}
              theme={currentTheme}
              themes={themes}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <InputArea
          message={message}
          handleChange={(e) => setMessage(e.target.value)}
          handleKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          handleSendMessage={handleSendMessage}
          handleEmojiClick={handleEmojiClick}
          handleMediaShare={handleMediaShare}
          uploading={false}
          isRecording={false}
          startRecording={() => { }}
          stopRecording={() => { }}
          selectedUser={selectedUser}
          currentTheme={currentTheme}
          themes={themes}
          inputRef={inputRef}
        />
      </Box>
      {showMediaSidebar && (
        <MediaSidebar
          media={sharedMedia}
          onClose={() => setShowMediaSidebar(false)}
        />
      )}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme={currentTheme === 'dark' ? 'dark' : 'light'}
            set="native"
            previewPosition="none"
            skinTonePosition="none"
          />
        </Box>
      </Popover>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chat;