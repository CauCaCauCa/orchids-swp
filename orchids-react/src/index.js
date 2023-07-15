import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { NotificationContextProvider } from './context/NotificationContext';
import ConfirmContextProvider from './context/ConfirmContext';

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif;', // Replace 'Your Custom Font' with your desired font name
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /* global google */
  <Providers>
    {/* <CssBaseline /> */}
    <App />
  </Providers>
);

function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <NotificationContextProvider>
        <ConfirmContextProvider>
          {children}
        </ConfirmContextProvider>
      </NotificationContextProvider>
    </ThemeProvider >
  )
}