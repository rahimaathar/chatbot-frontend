import React, { useState, useRef } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
    CircularProgress,
    TextField,
} from '@mui/material';
import {
    Send as SendIcon,
    Image as ImageIcon,
    EmojiEmotions as EmojiIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    AttachFile,
} from '@mui/icons-material';
import { bounce, pulse } from '../styles/animations';
import './chat.css';

const InputArea = ({
    message,
    handleChange,
    handleKeyPress,
    handleSendMessage,
    handleEmojiClick,
    handleMediaShare,
    uploading,
    isRecording,
    startRecording,
    stopRecording,
    selectedUser,
    currentTheme,
    themes,
    inputRef,
}) => {
    const [isRecordingLocal, setIsRecordingLocal] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecordingHandler = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

             
                const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });

            
                handleMediaShare(audioFile);

        
                stream.getTracks().forEach(track => track.stop());
                URL.revokeObjectURL(audioUrl);
                setRecordingTime(0);
            };

            mediaRecorderRef.current.start();
            setIsRecordingLocal(true);

 
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        
            if (startRecording) startRecording();
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not start recording. Please check microphone permissions.');
        }
    };

    const stopRecordingHandler = () => {
        if (mediaRecorderRef.current && isRecordingLocal) {
            mediaRecorderRef.current.stop();
            setIsRecordingLocal(false);
            clearInterval(timerRef.current);

         
            if (stopRecording) stopRecording();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getInputStyles = () => {
        const baseStyles = {
            '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: currentTheme === 'dark' ? '#2d2d44' : 'rgba(255, 255, 255, 0.9)',
                '& fieldset': {
                    borderColor: currentTheme === 'dark' ? '#4a4e69' : 'rgba(255, 105, 180, 0.3)',
                    borderWidth: '2px',
                },
                '&:hover fieldset': {
                    borderColor: currentTheme === 'dark' ? '#6c63ff' : 'rgba(255, 105, 180, 0.5)',
                },
                '&.Mui-focused fieldset': {
                    borderColor: currentTheme === 'dark' ? '#6c63ff' : '#ff1493',
                },
            },
            '& .MuiOutlinedInput-input': {
                color: currentTheme === 'dark' ? '#ffffff' : '#ff69b4',
                '&::placeholder': {
                    color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 105, 180, 0.5)',
                    opacity: 1,
                },
            },
        };

        return baseStyles;
    };

    return (
        <Box className="input-area">
            <Box className="input-container">
                <Tooltip title="Add Emoji">
                    <IconButton
                        onClick={handleEmojiClick}
                        className="icon-button"
                    >
                        <EmojiIcon />
                    </IconButton>
                </Tooltip>
                <TextField
                    inputRef={inputRef}
                    className="chat-input"
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedUser ? `Message ${selectedUser}...` : "Type a message..."}
                    variant="outlined"
                    fullWidth
                    sx={getInputStyles()}
                />
                <Tooltip title={isRecordingLocal ? "Stop Recording" : "Start Voice Message"}>
                    <IconButton
                        onClick={isRecordingLocal ? stopRecordingHandler : startRecordingHandler}
                        className="icon-button"
                        sx={{
                            animation: isRecordingLocal ? 'pulse 1s infinite' : 'none',
                            color: isRecordingLocal ? '#ff4444' : 'inherit',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: isRecordingLocal ? 'rgba(255, 68, 68, 0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isRecordingLocal ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 105, 180, 0.1)',
                            }
                        }}
                    >
                        {isRecordingLocal ? (
                            <>
                                <MicOffIcon />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'rgba(255, 68, 68, 0.9)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        animation: 'pulse 1s infinite'
                                    }}
                                >
                                    {formatTime(recordingTime)}
                                </Box>
                            </>
                        ) : (
                            <MicIcon />
                        )}
                    </IconButton>
                </Tooltip>
                <IconButton
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || uploading}
                    size="large"
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default InputArea; 
