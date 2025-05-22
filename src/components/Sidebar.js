import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemButton, Typography, IconButton, Divider, Tooltip } from '@mui/material';
import { Add as AddIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import './chat.css';

const Sidebar = ({
    open,
    toggleOpen,
    users,
    selectedUser,
    onUserSelect,
    rooms,
    currentRoom,
    onRoomChange,
    onCreateRoom,
    theme
}) => {
    const getInitials = (name) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <Box
            className={`sidebar ${!open ? 'collapsed' : ''}`}
        >
            <Box className="sidebar-content">
                <Box className="sidebar-header">
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Chat
                    </Typography>
                </Box>
                <Divider />

                {/* Rooms Section */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Rooms
                    </Typography>
                    <List>
                        {rooms.map((room) => (
                            <ListItem key={room} disablePadding>
                                <ListItemButton
                                    selected={currentRoom === room}
                                    onClick={() => onRoomChange(room)}
                                >
                                    <ListItemText primary={room} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton onClick={onCreateRoom}>
                                <AddIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Create Room" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>

                <Divider />

                {/* Users Section */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Online Users
                    </Typography>
                    <List>
                        {users.map((user) => (
                            <ListItem key={user} disablePadding>
                                <ListItemButton
                                    selected={selectedUser === user}
                                    onClick={() => onUserSelect(user)}
                                >
                                    <div className="user-avatar">
                                        {getInitials(user)}
                                    </div>
                                    <ListItemText primary={user} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>

            {/* Toggle Button */}
            <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"} placement="right">
                <Box
                    className={`sidebar-toggle ${theme}`}
                    onClick={toggleOpen}
                >
                    <IconButton
                        sx={{
                            color: 'white',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
            </Tooltip>
        </Box>
    );
};

export default Sidebar; 