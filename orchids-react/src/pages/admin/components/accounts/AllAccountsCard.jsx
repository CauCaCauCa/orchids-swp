import { useContext } from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import { AccountContext } from '../../context/providers/AccountContext';
import { NotificationContext } from '../../../../context/NotificationContext';
import { AccountDetailsContext } from '../../context/AccountDetailsContext';
import { ConfirmContext } from '../../../../context/ConfirmContext';
import DropdownMenu from '../../../../components/common/DropdownMenu';
import CustomTablePaginated from '../../../../components/common/CustomTablePaginated';
import { SelectItem, TableColumn } from '../../util/classes';
import useSelectField from '../../hooks/useSelectField';

const columns = [
    new TableColumn('email', 'Email', 100, (row) => row.email),
    new TableColumn('username', 'Name', 100, (row) => row.username),
    new TableColumn('role', 'Role', 100, (row) => (
        <Chip
            label={row.role}
            color={row.role === 'AD' ? 'warning' : 'primary'}
        />
    ))
];

function Actions({ row }) {
    const { toggleDeactivateAccount, makeAdmin } =
        useContext(AccountContext).functions;
    const { showSuccess, showError } = useContext(NotificationContext);
    const { handleOpen } = useContext(AccountDetailsContext);
    const { openConfirm } = useContext(ConfirmContext);

    function handleToggleDeactivateAccount(email) {
        toggleDeactivateAccount(email)
            ? showSuccess('Deactivated account successfully')
            : showError('Failed to deactivate account');
    }

    function handleMakeAdmin(email) {
        makeAdmin(email)
            ? showSuccess('Made account admin successfully')
            : showError('Failed to make account admin');
    }

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
                                'Are you sure you want to make this account an admin?',
                                () => handleMakeAdmin(row.email)
                            )
                        }
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="make-admin"
                        disabled={row.role === 'AD' || row.status === false}
                    >
                        <SecurityIcon />
                        <Typography variant="body1">Make admin</Typography>
                    </Button>,
                    <Button
                        onClick={() =>
                            openConfirm(
                                'Are you sure you want to deactivate this account?',
                                () => handleToggleDeactivateAccount(row.email)
                            )
                        }
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="deactivate"
                        disabled={row.role === 'AD' || row.status === false}
                    >
                        <DeleteIcon />
                        <Typography variant="body1">Deactivate</Typography>
                    </Button>
                ]}
            />
        </Box>
    );
}

export default function AllAccountsCard() {
    const { accounts, changePage, isLoading, totalAccounts } =
        useContext(AccountContext).data;

    const [data, getComponent] = useSelectField('Search by', [
        new SelectItem('email', 'Email'),
        new SelectItem('username', 'Username')
    ]);

    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h5" fontWeight="bold">
                    Accounts
                </Typography>
                <Box>
                    <TextField label="Search" variant="outlined" />
                    {getComponent()}
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Box>
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
