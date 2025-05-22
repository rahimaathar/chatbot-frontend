import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import {
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
    Palette as BlueIcon,
    Grass as GreenIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { themeService } from '../services/theme';

const ThemeSelector = ({ open, onClose, onThemeChange }) => {
    const currentTheme = useTheme();
    const availableThemes = themeService.getAvailableThemes();

    const getThemeIcon = (themeName) => {
        switch (themeName) {
            case 'dark':
                return <DarkIcon />;
            case 'light':
                return <LightIcon />;
            case 'blue':
                return <BlueIcon />;
            case 'green':
                return <GreenIcon />;
            default:
                return <LightIcon />;
        }
    };

    const handleThemeSelect = (themeName) => {
        if (themeService.setTheme(themeName)) {
            onThemeChange(themeName);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: currentTheme.palette.background.paper
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2
            }}>
                <Typography variant="h6">Select Theme</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List>
                    {availableThemes.map((themeName) => (
                        <ListItem
                            key={themeName}
                            button
                            onClick={() => handleThemeSelect(themeName)}
                            sx={{
                                '&:hover': {
                                    bgcolor: currentTheme.palette.action.hover
                                }
                            }}
                        >
                            <ListItemIcon>
                                {getThemeIcon(themeName)}
                            </ListItemIcon>
                            <ListItemText
                                primary={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                                secondary={`${themeName} theme`}
                            />
                            {themeName === themeService.getCurrentThemeName() && (
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: currentTheme.palette.primary.main,
                                        ml: 1
                                    }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ThemeSelector; 