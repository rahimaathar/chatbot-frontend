import { createTheme } from '@mui/material/styles';

const themes = {
    light: createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: '#f5f5f5',
                paper: '#ffffff',
            },
        },
    }),
    dark: createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9',
            },
            secondary: {
                main: '#f48fb1',
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
        },
    }),
    blue: createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#2196f3',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: '#e3f2fd',
                paper: '#ffffff',
            },
        },
    }),
    green: createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#4caf50',
            },
            secondary: {
                main: '#ff4081',
            },
            background: {
                default: '#e8f5e9',
                paper: '#ffffff',
            },
        },
    }),
};

class ThemeService {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    getTheme() {
        return themes[this.currentTheme] || themes.light;
    }

    setTheme(themeName) {
        if (themes[themeName]) {
            this.currentTheme = themeName;
            localStorage.setItem('theme', themeName);
            return true;
        }
        return false;
    }

    getAvailableThemes() {
        return Object.keys(themes);
    }

    getCurrentThemeName() {
        return this.currentTheme;
    }
}

export const themeService = new ThemeService(); 