import { Alert, Snackbar } from '@mui/material';
import { createContext, useState } from 'react';

export const NotificationContext = createContext({});

export const NotificationContextProvider = ({ children }) => {

    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = (message, type) => {
        setMessage(message);
        setAlertType(type);
        setOpen(true);
    }

    const showSuccess = (message) => {
        handleOpen(message, 'success')
    }

    const showError = (message) => {
        handleOpen(message, 'error');
    }

    const showWarning = (message) => {
        handleOpen(message, 'warning');
    }

    const showInfo = (message) => {
        handleOpen(message, 'info');
    }

    return (
        <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    severity={alertType}
                    variant='filled'
                    onClose={handleClose}
                >
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    )
}