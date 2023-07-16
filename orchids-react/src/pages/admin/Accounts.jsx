import { Box, Grid } from '@mui/material';
import AllAccountsCard from './components/accounts/AllAccountsCard';
import AccountStatsCard from './components/accounts/AccountStatsCard';
import AdminsCard from './components/accounts/AdminsCard';
import AccountCreationGraphCard from './components/accounts/AccountCreationGraphCard';

export default function Accounts() {
    return (
        <Box id="accounts" width="100%">
            <h1>Account Management</h1>
            <Grid container spacing={2} width="100%">
                <Grid item xs={12} md={8}>
                    <AllAccountsCard />
                </Grid>
                <Grid item xs={12} md={4}>
                    <AccountStatsCard />
                </Grid>
                <Grid item xs={12} md={4}>
                    <AdminsCard />
                </Grid>
                <Grid item xs={12} md={8}>
                    <AccountCreationGraphCard />
                </Grid>
            </Grid>
        </Box>
    );
}
