import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import { createContext, useState } from 'react';
import IconImage from '../../../components/common/IconImage';
import { GetOneAccount } from '../../../api/adminAPI';


export const AccountDetailsContext = createContext({});

export default function AccountDetailsProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(null);

    function handleOpen(account) {
        setOpen(true);
        setCurrent(account);
    }
    
    function handleOpenFetch(accountEmail) {
        setCurrent(null);
        setOpen(true);
        const fetchByEmail = async () => {
            const response = await GetOneAccount(accountEmail);
            if (response) {
                setCurrent(response);
            } else {
                console.log('FAILURE');
            }
        };
        accountEmail && fetchByEmail();
    }

    return (
        <AccountDetailsContext.Provider value={{ handleOpen, handleOpenFetch }}>
            {children}
            {current === undefined || current === null ? (
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
                    <DialogTitle>Account Details</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <CircularProgress />
                        <Typography component="div" variant="body1">
                            Loading...
                        </Typography>
                    </DialogContent>
                </Dialog>
            ) : (
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
                    <DialogTitle>Account Details</DialogTitle>
                    <DialogContent>
                        <Box position="relative" mb={10}>
                            <IconImage
                                src={current.bground}
                                alt="background"
                                height="20rem"
                                width="70vw"
                                sx={{
                                    objectFit: 'cover',
                                    borderRadius: '1rem'
                                }}
                            />
                            <IconImage
                                src={current.avatar}
                                alt="avatar"
                                position="absolute"
                                bottom={0}
                                left={0}
                                sx={{
                                    height: '100px',
                                    borderRadius: '50%',
                                    transform: 'translate(50%, 50%)'
                                }}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={6}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                            >
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <h3>Account Details</h3>
                                    <Box>Name: {current.username}</Box>
                                    <Box>Email: {current.email}</Box>
                                    <Box>Role: {current.role}</Box>
                                    <Box>Created: {current.created_at}</Box>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                            >
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        bgcolor: current.status
                                            ? 'green'
                                            : 'red',
                                        color: 'white'
                                    }}
                                >
                                    Status:{' '}
                                    {current.status
                                        ? 'activated'
                                        : 'deactivated'}
                                </Paper>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <h3>Account interactions</h3>
                                    <Box>
                                        This user has made{' '}
                                        <strong>
                                            {current.numberPost} post(s) and{' '}
                                            {current.numberQuestion} question(s)
                                        </strong>{' '}
                                        to the website.
                                    </Box>
                                    <Box>
                                        Following:{' '}
                                        {current.ListEmailFollowing?.length}
                                    </Box>
                                    <Box>
                                        Followers:{' '}
                                        {current.ListEmailFollower?.length}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </AccountDetailsContext.Provider>
    );
}
