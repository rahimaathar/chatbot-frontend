import React from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import CustomAudioPlayer from './CustomAudioPlayer';
import './chat.css';

const ChatBubble = ({ message, isOwnMessage, theme, themes }) => {
    const renderMessageContent = () => {
        if (message.type === 'voice') {
            return (
                <Box
                    className={`voice-message ${message.isRecording ? 'recording' : ''}`}
                    sx={{
                        backgroundColor: isOwnMessage
                            ? themes[theme].bubble.sent.bg
                            : themes[theme].bubble.received.bg,
                        position: 'relative',
                        padding: '12px 16px',
                    }}
                >
                    <CustomAudioPlayer
                        src={message.content}
                        duration={message.duration}
                        theme={theme}
                        isOwnMessage={isOwnMessage}
                    />
                </Box>
            );
        }

        return (
            <Typography className="chat-message">
                {message.content}
            </Typography>
        );
    };

    return (
        <Box
            className={`chat-bubble-container ${isOwnMessage ? 'sent' : 'received'}`}
            sx={{
                '& .chat-bubble.sent': {
                    bgcolor: themes[theme].bubble.sent.bg,
                    color: themes[theme].bubble.sent.text,
                },
                '& .chat-bubble.received': {
                    bgcolor: themes[theme].bubble.received.bg,
                    color: themes[theme].bubble.received.text,
                },
                '& .chat-timestamp.sent': {
                    color: themes[theme].bubble.sent.text,
                },
                '& .chat-timestamp.received': {
                    color: themes[theme].bubble.received.text,
                },
            }}
        >
            <Box className={`chat-bubble ${isOwnMessage ? 'sent' : 'received'}`}>
                {!isOwnMessage && (
                    <Typography
                        variant="caption"
                        className="chat-sender"
                        sx={{ color: theme === 'dark' ? '#e0e0e0' : '#ff69b4' }}
                    >
                        {message.sender}
                    </Typography>
                )}
                {renderMessageContent()}
                <Typography
                    variant="caption"
                    className={`chat-timestamp ${isOwnMessage ? 'sent' : 'received'}`}
                >
                    {format(new Date(message.timestamp), 'HH:mm')}
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatBubble; 