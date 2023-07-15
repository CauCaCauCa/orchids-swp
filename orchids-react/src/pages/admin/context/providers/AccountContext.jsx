import {
    FetchAccountsByPage,
    GetAccountsStats,
    ToggleAdmin,
    ToggleDeactivateAccount
} from '../../../../api/adminAPI';
import usePage from '../../hooks/usePage';
import useFetch from '../../hooks/useFetch';

const { createContext, useState } = require('react');

export const AccountContext = createContext({});

export default function AccountContextProvider({ children }) {
    const [filterString, setFilterString] = useState();

    const {
        list: accounts,
        setList: setAccounts,
        changePage,
        total: totalAccounts,
        isLoading
    } = usePage(FetchAccountsByPage);

    const {
        list: admins,
        setList: setAdmins,
        changePage: adminsChangePage,
        total: totalAdmins,
        isLoading: adminsIsLoading,
        refresh: refreshAdmins
    } = usePage(FetchAccountsByPage, { role: 'AD' });

    const {
        data: accountStats,
        refresh: refreshAccountStats,
        isLoading: isLoadingAccountStats
    } = useFetch(GetAccountsStats);

    const toggleDeactivateAccount = async (email) => {
        const save = async () => {
            const response = await ToggleDeactivateAccount(email);
            if (response) {
                return true;
            } else {
                return false;
            }
        };

        setAccounts((list) =>
            list.map((account) =>
                account.email === email
                    ? { ...account, status: !account.status }
                    : account
            )
        );

        await save();
        refreshAccountStats();
        refreshAdmins();
    };

    const makeAdmin = async (email) => {
        const save = async () => {
            const response = await ToggleAdmin(email, "AD");
            if (response) {
                console.log(response);
                return true;
            } else {
                return false;
            }
        };

        setAccounts((list) =>
            list.map((account) =>
                account.email === email ? { ...account, role: 'AD' } : account
            )
        );

        await save();

        refreshAdmins();
        refreshAccountStats();
    };

    const removeAdmin = async (email) => {
        const save = async () => {
            const response = await ToggleAdmin(email, "US");
            if (response) {
                return true;
            } else {
                return false;
            }
        };

        setAccounts((list) =>
            list.map((account) =>
                account.email === email ? { ...account, role: 'US' } : account
            )
        );

        await save();
        refreshAdmins();
        refreshAccountStats();
    };

    return (
        <AccountContext.Provider
            value={{
                data: {
                    accounts,
                    changePage,
                    isLoading,
                    totalAccounts,
                    currentFilter: filterString
                },
                functions: {
                    toggleDeactivateAccount,
                    setFilter: setFilterString,
                    makeAdmin,
                    removeAdmin
                },
                stats: {
                    accountStats,
                    isLoadingAccountStats
                },
                admins: {
                    admins,
                    adminsChangePage,
                    adminsIsLoading,
                    totalAdmins
                }
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}
