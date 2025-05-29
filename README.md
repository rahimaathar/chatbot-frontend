# Chat Application Frontend

A modern, responsive chat application frontend built with React, featuring real-time messaging, room management, and a beautiful user interface.

## 🚀 Features

- **Real-time Chat**: Instant message delivery using WebSocket
- **Room Management**: Create and join different chat rooms
- **Private Messaging**: Direct user-to-user communication
- **User Interface**:
  - Modern, responsive design
  - Dark/Light mode support
  - Real-time user presence
  - Message history
  - Typing indicators
- **User Experience**:
  - Smooth animations
  - Error handling
  - Connection status indicators
  - Message delivery status
- **Security**:
  - Secure WebSocket connection
  - Input sanitization
  - Error boundary protection

## 🛠️ Tech Stack

- **Core**:
  - React 18+
  - TypeScript
  - Vite (Build tool)
- **Styling**:
  - Tailwind CSS
  - CSS Modules
- **State Management**:
  - React Context
  - Custom Hooks
- **WebSocket**:
  - Native WebSocket API
- **Development**:
  - ESLint
  - Prettier
  - TypeScript

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/rahimaathar/chat-app.git
cd chat-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_WS_URL=ws://localhost:10000/ws
VITE_API_URL=http://localhost:10000
```

## 🚀 Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## 📱 Features in Detail

### Chat Rooms
- Join existing rooms
- Create new rooms
- Room-specific message history
- Room member list

### Private Messaging
- Direct user-to-user chat
- Message history
- Online status indicators
- Typing indicators

### User Interface
- Responsive design for all devices
- Dark/Light mode toggle
- Message timestamps
- User avatars
- Emoji support
- File sharing (if implemented)

### Real-time Features
- Instant message delivery
- User presence updates
- Typing indicators
- Connection status
- Message delivery status

## 🎨 UI Components

- **ChatWindow**: Main chat interface
- **MessageList**: Message history display
- **MessageInput**: Message composition
- **UserList**: Online users display
- **RoomList**: Available rooms
- **StatusBar**: Connection and user status
- **Settings**: User preferences

## 🔧 Configuration

The application can be configured through environment variables:

```env
VITE_WS_URL=ws://localhost:10000/ws  # WebSocket server URL
VITE_API_URL=http://localhost:10000  # API server URL
VITE_APP_NAME=Chat App               # Application name
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
# or
yarn test
```

## 📦 Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── context/       # React context providers
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── styles/        # CSS and styling
└── App.tsx        # Root component
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.


