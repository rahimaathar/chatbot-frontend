// Constants
const CONNECTION_TIMEOUT = 10000;
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const PING_INTERVAL = 30000;
const PONG_TIMEOUT = 15000;

// Get WebSocket URL from environment or fallback to Render URL
const WS_URL = process.env.REACT_APP_WS_URL || 'wss://chatbot-backend-1b31.onrender.com';

// Add connection options
const WS_OPTIONS = {
  timeout: CONNECTION_TIMEOUT,
};

class WebSocketService {
  constructor() {
    this.ws = null;
    this.handlers = {
      message: new Set(),
      error: new Set(),
      close: new Set(),
      open: new Set(),
      userList: new Set(),
      typing: new Set(),
      privateMessage: new Set(),
    };
    this.state = {
      isConnecting: false,
      isReconnecting: false,
      reconnectAttempts: 0,
      currentUsername: null,
      lastPong: null,
      connectionStatus: 'disconnected', // 'disconnected'|'connecting'|'connected'|'error'
    };
    this.timers = {
      reconnect: null,
      ping: null,
      connectionTimeout: null,
    };
    this.messageQueue = [];
  }

  // Public API
  async connect(username) {
    if (this.state.isConnecting || this.isConnected) {
      throw new Error(`Already ${this.state.connectionStatus}`);
    }

    this.state = {
      ...this.state,
      isConnecting: true,
      currentUsername: username,
      connectionStatus: 'connecting',
    };

    try {
      await this._establishConnection();
      await this._sendConnectMessage(username);
      this._startHeartbeat();
      this._processMessageQueue();
      return true;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  disconnect() {
    this._cleanup();
    this.messageQueue = [];
    this.state = {
      ...this.state,
      connectionStatus: 'disconnected',
      currentUsername: null,
      reconnectAttempts: 0,
      isReconnecting: false,
    };
  }

  sendMessage(content, room = 'general') {
    if (!this.isConnected) {
      console.error('Cannot send message: not connected');
      return;
    }

    const message = {
      type: 'message',
      content,
      room,
      timestamp: new Date().toISOString(),
    };

    try {
      this._send(message);
      console.debug('Sent message:', message);
    } catch (error) {
      console.error('Error sending message:', error);
      this._handleError(error);
    }
  }

  sendPrivateMessage(to, content) {
    this._send({
      type: 'private',
      to,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  sendTypingIndicator(to) {
    this._send({
      type: 'typing',
      to,
      timestamp: new Date().toISOString(),
    });
  }

  // Event handling
  on(event, handler) {
    if (!this.handlers[event]) {
      throw new Error(`Invalid event type: ${event}`);
    }
    this.handlers[event].add(handler);
    return () => this.handlers[event].delete(handler);
  }

  get status() {
    return this.state.connectionStatus;
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Private methods
  async _establishConnection() {
    this._cleanup();

    console.debug('Connecting to:', WS_URL);

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.timers.connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            const error = new Error('Connection timeout');
            this._handleError(error);
            this.ws?.close(1000, 'Timeout');
            reject(error);
          }
        }, WS_OPTIONS.timeout);

        this.ws.onopen = () => {
          clearTimeout(this.timers.connectionTimeout);
          this._updateState({
            isConnecting: false,
            reconnectAttempts: 0,
            connectionStatus: 'connected',
          });
          this._emit('open');
          resolve();
        };

        this.ws.onmessage = this._handleMessage.bind(this);
        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          const error = new Error('WebSocket connection error');
          this._handleError(error);
          reject(error);
        };
        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this._handleClose(event);
          reject(new Error(`Connection closed: ${event.reason}`));
        };
      } catch (error) {
        this._handleError(error);
        reject(error);
      }
    });
  }

  _handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      console.debug('Received:', message);

      switch (message.type) {
        case 'error':
          console.error('Server error:', message.content);
          this._handleError(new Error(message.content));
          if (message.content.includes('Username')) {
            this.disconnect();
          }
          break;
        case 'pong':
          this.state.lastPong = Date.now();
          break;
        case 'user_list':
          this._emit('userList', message.users);
          break;
        case 'message':
        case 'private':
        case 'system':
          this._emit(message.type, message);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Message parsing error:', error);
      this._handleError(error);
    }
  }

  _handleClose(event) {
    console.log('Connection closed:', event.code, event.reason);
    this._updateState({ connectionStatus: 'disconnected' });
    this._cleanup();
    this._emit('close', event);

    if (event.code !== 1000 && !this.state.isReconnecting) {
      this._scheduleReconnect();
    }
  }

  _scheduleReconnect() {
    if (this.state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this._handleError(new Error('Max reconnection attempts reached'));
      return;
    }

    this._updateState({
      isReconnecting: true,
      reconnectAttempts: this.state.reconnectAttempts + 1,
    });

    const delay = Math.min(
      BASE_RECONNECT_DELAY * Math.pow(2, this.state.reconnectAttempts - 1),
      MAX_RECONNECT_DELAY
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.state.reconnectAttempts})`);
    this.timers.reconnect = setTimeout(() => {
      if (this.state.currentUsername) {
        this.connect(this.state.currentUsername).catch((error) => {
          console.error('Reconnection failed:', error);
          this._updateState({ isReconnecting: false });
        });
      }
    }, delay);
  }

  _startHeartbeat() {
    this.state.lastPong = Date.now();
    this._stopHeartbeat();

    this.timers.ping = setInterval(() => {
      if (this.isConnected) {
        this._send({ type: 'ping' });

        if (Date.now() - this.state.lastPong > PONG_TIMEOUT) {
          console.warn('No pong received - reconnecting');
          this.ws.close();
        }
      }
    }, PING_INTERVAL);
  }

  _stopHeartbeat() {
    if (this.timers.ping) {
      clearInterval(this.timers.ping);
      this.timers.ping = null;
    }
  }

  async _sendConnectMessage(username) {
    return new Promise((resolve) => {
      const connectMsg = { type: 'connect', username };
      this._send(connectMsg, resolve);
    });
  }

  _send(message, callback) {
    if (this.isConnected) {
      try {
        const messageStr = JSON.stringify(message);
        this.ws.send(messageStr);
        console.debug('WebSocket send:', messageStr);
        callback?.();
      } catch (error) {
        console.error('Send error:', error);
        this.messageQueue.push(message);
        this._handleError(error);
      }
    } else {
      console.warn('Message queued (not connected):', message);
      this.messageQueue.push(message);
    }
  }

  _processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      try {
        this._send(message);
        console.debug('Processed queued message:', message);
      } catch (error) {
        console.error('Error processing queued message:', error);
        this.messageQueue.unshift(message); // Put the message back at the start of the queue
        break;
      }
    }
  }

  _handleError(error) {
    console.error('WebSocket error:', error);
    this._updateState({ connectionStatus: 'error' });
    this._emit('error', error instanceof Error ? error : new Error(error));
  }

  _emit(event, ...args) {
    if (this.handlers[event]) {
      this.handlers[event].forEach((handler) => handler(...args));
    }
  }

  _updateState(updates) {
    this.state = { ...this.state, ...updates };
  }

  _cleanup() {
    if (this.ws) {
      this._stopHeartbeat();
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;

      if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) {
        try {
          this.ws.close(1000, 'Cleanup');
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
      this.ws = null;
    }

    Object.values(this.timers).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });

    this._updateState({ isConnecting: false });
  }
}

// Singleton instance
export const websocketService = new WebSocketService();