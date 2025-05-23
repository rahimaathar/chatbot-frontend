import React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Paper,
} from '@mui/material';
import './chat.css';

const ConnectionScreen = ({
    username,
    setUsername,
    handleConnect,
    currentTheme,
    isLoading,
    error,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleConnect();
    };

    return (
        <Paper className="login-paper">
            <Typography variant="h4" gutterBottom>
                HelloME
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Enter your username to start chatting
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    error={!!error}
                    helperText={error}
                />
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading || !username.trim()}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Connect'
                    )}
                </Button>
            </form>
        </Paper>
    );
};

export default ConnectionScreen; 
