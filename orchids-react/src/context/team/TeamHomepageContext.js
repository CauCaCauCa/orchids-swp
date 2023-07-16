import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { AddMemberToTeam, RemoveMemberFromTeam, UpdateMemberFromTeam, UpdateTeam, getSpecificTeamDetails } from "../../api/teamAPI";
import { NotificationContext } from "../NotificationContext";
import EditTeamModal from "../../components/team/team_edit/EditTeamModal";
import TeamPostContextProvider from "./TeamPostsContextProvider";

export const TeamHomepageContext = createContext();

export default function TeamHomepageContextProvider({ children }) {
    const navigate = useNavigate();

    const id = useParams().id || navigate('/404');
    const [team, isLoadingTeams, refresh, setTeam] = useFetch(getSpecificTeamDetails, id);
    const { showSuccess, showError } = useContext(NotificationContext);

    const role = useMemo(() => {
        if (!team) return '';
        const currentEmail = localStorage.getItem('email');
        if (team.EmailOwner.email === currentEmail) return 'creator'; // check if user is creator

        var role = team.ListEmailMember.find(member => member.email === currentEmail); // check if user is admin
        if (role) return role.role;

        return ''; // if none, then user is a viewer
    }, [team])

    // #region edit team modal
    const [isOpenEditTeamModal, setIsOpenEditTeamModal] = useState(false);
    function openEditTeamModal() {
        setIsOpenEditTeamModal(true);
    }
    // #endregion

    // #region functions

    function updateTeamDetails(name, description, bground, avatar) {
        const update = async () => {
            const response = await UpdateTeam(team.email, name, description, bground, avatar);

            if (response) {
                setTeam((prev) => {
                    return {
                        ...prev,
                        teamname: name,
                        description: description,
                        bground: bground,
                        avatar: avatar
                    };
                });
                showSuccess('Cập nhật thành công!');
            } else {
                showError('Cập nhật thất bại');
            }
        }
        update()
    }

    function updateTeamMember(memberEmail, role) {
        const updateMemberInDB = async () => {
            const response = await UpdateMemberFromTeam(team.email, memberEmail, role);
            if (response) {
                team.ListEmailMember = team.ListEmailMember.map((member) => {
                    if (member.details.email === memberEmail) {
                        member.role = role;
                    }
                    return member;
                })
                setTeam({ ...team })
                showSuccess("Cập nhật thành công");
            } else {
                showError("Cập nhật thất bại");
            }
        }

        updateMemberInDB();
    }

    function removeTeamMember(memberEmail) {
        const deleteMemberFromDB = async () => {
            const response = await RemoveMemberFromTeam(team.email, memberEmail);
            if (response) {
                team.ListEmailMember = team.ListEmailMember.filter((mem) => mem.email !== memberEmail);
                setTeam({ ...team });
                showSuccess("Xóa thành công");
            }
            else {
                showError("Xóa thất bại");
            }
        }

        deleteMemberFromDB();
    }

    function addTeamMember(memberEmail, role) {
        const addMemberToDB = async () => {
            const response = await AddMemberToTeam(team.email, memberEmail, role);
            if (response) {
                team.ListEmailMember.push(response)
                setTeam({ ...team })
                showSuccess("Thêm thành công");
            }
            else {
                showError("Thêm thất bại");
            }
        }

        addMemberToDB();
    }


    // #endregion

    if(isLoadingTeams) return <></>

    return (
        <TeamHomepageContext.Provider value={{
            team, setTeam, isLoadingTeams, role, openEditTeamModal,
            teamDetails: {
                update: updateTeamDetails
            },
            members: {
                add: addTeamMember,
                remove: removeTeamMember,
                update: updateTeamMember
            },
        }}>
            <TeamPostContextProvider>
                {children}
                <EditTeamModal open={isOpenEditTeamModal} setOpen={setIsOpenEditTeamModal} />
            </TeamPostContextProvider>
        </TeamHomepageContext.Provider>
    )
}