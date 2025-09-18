import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
    Avatar,
    CircularProgress
} from '@mui/material';
import {
    Google as GoogleIcon,
    Email as EmailIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            setError('');
        
        } catch (error) {
            setError('Failed to authenticate with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            if (isLogin) {
               
            } else {
                
            }
        } catch (error) {
            setError(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            backgroundImage: 'linear-gradient(45deg, #fff0f5 25%, #ffe4e1 25%, #ffe4e1 50%, #fff0f5 50%, #fff0f5 75%, #ffe4e1 75%, #ffe4e1 100%)',
            backgroundSize: '20px 20px'
        }}>
            <Paper sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: `${pulse} 2s infinite`
            }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: '#ff69b4',
                            animation: `${bounce} 2s infinite`
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ color: '#ff69b4', fontWeight: 'bold' }}>
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </Typography>
                </Box>

                <form onSubmit={handleEmailAuth}>
                    {!isLogin && (
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                    )}
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        required
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{
                            bgcolor: '#ff69b4',
                            color: '#ffffff',
                            py: 1.5,
                            mb: 2,
                            '&:hover': {
                                bgcolor: '#ff1493',
                                animation: `${bounce} 1s`
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </Button>
                </form>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    sx={{
                        borderColor: '#ff69b4',
                        color: '#ff69b4',
                        '&:hover': {
                            borderColor: '#ff1493',
                            bgcolor: 'rgba(255, 105, 180, 0.1)',
                            animation: `${bounce} 1s`
                        }
                    }}
                >
                    Continue with Google
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                        color="inherit"
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{ color: '#ff69b4' }}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Auth; 
