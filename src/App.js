import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Chat from './components/Chat';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#36393f',
      paper: '#2f3136',
    },
  },
  typography: {
    fontFamily: '"Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Chat />
    </ThemeProvider>
  );
}

export default App;
