import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Badge,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Block as BlockIcon,
    Report as ReportIcon,
    Palette as PaletteIcon
} from '@mui/icons-material';
import { authService } from '../services/auth';

const UserProfile = ({ user, onThemeChange, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [status, setStatus] = useState('online');

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        handleMenuClose();
    };

    const handleLogout = async () => {
        try {
            await authService.signOut();
            onLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return '#4caf50';
            case 'away':
                return '#ff9800';
            case 'busy':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <Tooltip title="Click to change status">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                        '& .MuiBadge-badge': {
                            bgcolor: getStatusColor(),
                            boxShadow: '0 0 0 2px white'
                        }
                    }}
                >
                    <Avatar
                        src={user.photoURL}
                        alt={user.displayName}
                        sx={{
                            width: 48,
                            height: 48,
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                        onClick={handleMenuOpen}
                    />
                </Badge>
            </Tooltip>

            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {user.displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {user.email}
                </Typography>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2
                    }
                }}
            >
                <MenuItem onClick={() => handleStatusChange('online')}>
                    <ListItemIcon>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: '#4caf50',
                                    boxShadow: '0 0 0 2px white'
                                }
                            }}
                        >
                            <Avatar sx={{ width: 24, height: 24 }} />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Online" />
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('away')}>
                    <ListItemIcon>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: '#ff9800',
                                    boxShadow: '0 0 0 2px white'
                                }
                            }}
                        >
                            <Avatar sx={{ width: 24, height: 24 }} />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Away" />
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('busy')}>
                    <ListItemIcon>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: '#f44336',
                                    boxShadow: '0 0 0 2px white'
                                }
                            }}
                        >
                            <Avatar sx={{ width: 24, height: 24 }} />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Busy" />
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit Profile" />
                </MenuItem>

                <MenuItem onClick={onThemeChange}>
                    <ListItemIcon>
                        <PaletteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Change Theme" />
                </MenuItem>

                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Block User" />
                </MenuItem>

                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <ReportIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Report Issue" />
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserProfile; 