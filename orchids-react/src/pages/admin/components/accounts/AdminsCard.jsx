import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ConfirmContext } from '../../../../context/ConfirmContext';
import { AccountDetailsContext } from '../../context/AccountDetailsContext';
import { AccountContext } from '../../context/providers/AccountContext';
import { NotificationContext } from '../../../../context/NotificationContext';
import DropdownMenu from '../../../../components/common/DropdownMenu';
import CustomTablePaginated from '../../../../components/common/CustomTablePaginated';

const columns = [
    {
        id: 'username',
        label: 'Name',
        minWidth: 100,
        component: (account) => account.username
    }
];

const Actions = ({ row }) => {
    const { openConfirm } = useContext(ConfirmContext);
    const { handleOpen } = useContext(AccountDetailsContext);
    const { removeAdmin } = useContext(AccountContext).functions;
    const { showSuccess, showError } = useContext(NotificationContext);

    const handleRemoveAdmin = (email) => {
        removeAdmin(email)
            ? showSuccess('Removed admin successfully')
            : showError('Failed to remove admin');
    };

    return (
        <Box>
            <DropdownMenu
                Icon={MoreVertIcon}
                options={[
                    <Button
                        onClick={() => handleOpen(row)}
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="view"
                    >
                        <RemoveRedEyeIcon />
                        <Typography variant="body1">View</Typography>
                    </Button>,
                    <Button
                        onClick={() =>
                            openConfirm(
                                'Are you sure you want to demote this account?',
                                () => handleRemoveAdmin(row.email)
                            )
                        }
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="view"
                    >
                        <RemoveModeratorIcon />
                        <Typography variant="body1">Demote</Typography>
                    </Button>
                ]}
            />
        </Box>
    );
};

export default function AdminsCard() {
    const {
        admins: accounts,
        adminsChangePage: changePage,
        adminsIsLoading: isLoading,
        totalAdmins: totalAccounts
    } = useContext(AccountContext).admins;
    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <h3>Admins</h3>
            <CustomTablePaginated
                listOfObjects={accounts}
                numberOfObjects={totalAccounts}
                Actions={Actions}
                columns={columns}
                isLoading={isLoading}
                changePage={changePage}
            />
        </Paper>
    );
}
