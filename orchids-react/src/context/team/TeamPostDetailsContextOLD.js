import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PostPage from '../../components/post_page/PostPage';
import { TeamHomepageContext } from './TeamHomepageContext';
import { GetTeam } from '../../api/teamAPI';

export const TeamPostDetailsContext = createContext();

const stylePopup = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100vh',
    zIndex: '1',
    backgroundColor: 'rgba(0,0,0,.5)',
    overflowY: 'scroll'
};

export default function TeamPostDetailsContextProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const { team } = useContext(TeamHomepageContext);

    const isMember = useMemo(() => {
        return (
            team.EmailOwner === localStorage.getItem('email') ||
            team.EmailOwner.email === localStorage.getItem('email') ||
            team.ListEmailMember.includes(localStorage.getItem('email'))
        );
    }, [team]);

    function handleOpen(data) {
        setData(data);
        setOpen(true);
    }

    return (
        <TeamPostDetailsContext.Provider
            value={{
                handleOpen
            }}
        >
            {children}
            {open && (
                <div style={stylePopup}>
                    <div>
                        <i
                            className="fa-solid fa-xmark fa-2xl"
                            onClick={() => setOpen(false)}
                            style={{
                                position: 'fixed',
                                top: '7rem',
                                right: '9rem',
                                color: 'black',
                                cursor: 'pointer'
                            }}
                        ></i>
                        <PostPage
                            PostData={{ ...data, username: team.teamname, avatar: team.avatar }}
                            isAllowedEdits={isMember}
                        />
                    </div>
                </div>
            )}
        </TeamPostDetailsContext.Provider>
    );
}
