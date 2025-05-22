import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Fade,
} from '@mui/material';
import {
    Image as ImageIcon,
    Palette as PaletteIcon,
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { pulse } from '../styles/animations';

const ChatHeader = ({
    selectedUser,
    currentTheme,
    themes,
    handleThemeClick,
    handleThemeClose,
    handleThemeSelect,
    themeAnchorEl,
    soundEnabled,
    toggleSound,
    handleLogout,
    setShowMediaSidebar,
    showMediaSidebar,
}) => {
    return (
        <Box
            sx={{
                p: 2,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: themes[currentTheme].shadow.light,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: themes[currentTheme].primary,
                    fontWeight: "bold",
                }}
            >
                {selectedUser ? `Chat with ${selectedUser}` : "HelloME"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
               
                <Tooltip title="Change theme">
                    <IconButton
                        onClick={handleThemeClick}
                        sx={{
                            color: themes[currentTheme].primary,
                            "&:hover": {
                                animation: `${pulse} 1s infinite`,
                            },
                        }}
                    >
                        <PaletteIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={themeAnchorEl}
                    open={Boolean(themeAnchorEl)}
                    onClose={handleThemeClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => handleThemeSelect('default')}>Default Theme</MenuItem>
                    <MenuItem onClick={() => handleThemeSelect('cute')}>Cute Theme</MenuItem>
                    <MenuItem onClick={() => handleThemeSelect('dark')}>Dark Theme</MenuItem>
                </Menu>
                <Tooltip title={soundEnabled ? "Disable sound" : "Enable sound"}>
                    <IconButton
                        onClick={toggleSound}
                        sx={{
                            color: themes[currentTheme].primary,
                            "&:hover": {
                                animation: `${pulse} 1s infinite`,
                            },
                        }}
                    >
                        {soundEnabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                    <IconButton
                        onClick={handleLogout}
                        sx={{
                            color: themes[currentTheme].primary,
                            "&:hover": {
                                animation: `${pulse} 1s infinite`,
                            },
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ChatHeader; 