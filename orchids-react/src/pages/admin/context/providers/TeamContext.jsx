import { createContext } from 'react';
import usePage from '../../hooks/usePage';
import { FetchTeamsByPage } from '../../../../api/adminAPI';

export const TeamContext = createContext({});

export default function TeamContextProvider({ children }) {
    const {
        list: teams,
        setList: setTeams,
        changePage,
        total: totalTeams,
        isLoading
    } = usePage(FetchTeamsByPage);

    return (
        <TeamContext.Provider
            value={{
                data: { teams, changePage, isLoading, totalTeams }
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}
