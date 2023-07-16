import {
    FetchAccountsByPage,
    GetAccountsStats,
    ToggleAdmin,
    ToggleDeactivateAccount
} from '../../../../api/adminAPI';
import usePage from '../../hooks/usePage';
import useFetch from '../../hooks/useFetch';

const { createContext } = require('react');

export const AccountContext = createContext({});

export default function AccountContextProvider({ children }) {
    const AllAccounts = usePage(FetchAccountsByPage);
    const Admins = usePage(FetchAccountsByPage, { role: 'AD' });
    const AccountStats = useFetch(GetAccountsStats);

    const toggleDeactivateAccount = async (email) => {
        const save = async () => {
            const response = await ToggleDeactivateAccount(email);
            if (response) {
                return true;
            } else {
                return false;
            }
        };

        AllAccounts.setList((list) =>
            list.map((account) =>
                account.email === email
                    ? { ...account, status: !account.status }
                    : account
            )
        );

        await save();
        AccountStats.refresh();
        Admins.refresh();
    };

    const makeAdmin = async (email) => {
        const save = async () => {
            const response = await ToggleAdmin(email, 'AD');
            if (response) {
                console.log(response);
                return true;
            } else {
                return false;
            }
        };

        AllAccounts.setList((list) =>
            list.map((account) =>
                account.email === email ? { ...account, role: 'AD' } : account
            )
        );

        await save();

        Admins.refresh();
        AccountStats.refresh();
    };

    const removeAdmin = async (email) => {
        const save = async () => {
            const response = await ToggleAdmin(email, 'US');
            if (response) {
                return true;
            } else {
                return false;
            }
        };

        AllAccounts.setList((list) =>
            list.map((account) =>
                account.email === email ? { ...account, role: 'US' } : account
            )
        );

        await save();
        Admins.refresh();
        AccountStats.refresh();
    };

    return (
        <AccountContext.Provider
            value={{
                data: {
                    accounts: AllAccounts.list,
                    changePage: AllAccounts.changePage,
                    isLoading: AllAccounts.isLoading,
                    totalAccounts: AllAccounts.total
                },
                functions: {
                    toggleDeactivateAccount,
                    makeAdmin,
                    removeAdmin
                },
                stats: {
                    accountStats: AccountStats.data,
                    isLoadingAccountStats: AccountStats.isLoading
                },
                admins: {
                    admins: Admins.list,
                    adminsChangePage: Admins.changePage,
                    adminsIsLoading: Admins.isLoading,
                    totalAdmins: Admins.total
                }
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}
