import { fetchAPI } from "./templateAPI";

// #region Team admin functions _ require token
export async function CreateTeam(teamname, description, bground, avatar) {
    return fetchAPI({
        method: 'POST',
        uri: '/team/create',
        Headers: {
            'Content-Type': 'application/json',
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({
            teamname,
            description,
            bground,
            avatar
        })
    });
}

export async function DeleteTeam(teamEmail) {
    return fetchAPI({
        method: 'DELETE',
        uri: `/team/delete/${teamEmail}`,
        Headers: {
            "authorization": localStorage.getItem('token')
        },
        body: undefined
    });
}

export async function UpdateTeam(teamEmail, teamname, description, bground, avatar) {
    return fetchAPI({
        method: 'PUT',
        uri: `/team/update/${teamEmail}`,
        Headers: {
            'Content-Type': 'application/json',
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({
            teamname,
            description,
            bground,
            avatar
        })
    });
}

export async function AddMemberToTeam(teamEmail, memberEmail, role) {
    console.log(teamEmail, memberEmail, role);
    return fetchAPI({
        method: 'POST',
        uri: `/team/${teamEmail}/create/member`,
        Headers: {
            'Content-Type': 'application/json',
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({
            memberEmail,
            role
        })
    });
}

export async function RemoveMemberFromTeam(teamEmail, memberEmail) {
    return fetchAPI({
        method: 'DELETE',
        uri: `/team/${teamEmail}/delete/member`,
        Headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({
            memberEmail
        })
    });
}

export async function UpdateMemberFromTeam(teamEmail, memberEmail, role) {
    return fetchAPI({
        method: 'PUT',
        uri: `/team/${teamEmail}/update/member`,
        Headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({
            memberEmail,
            role
        })
    })
}
// #endregion

export async function GetTeam(teamEmail) {
    return fetchAPI({
        method: 'GET',
        uri: `/team/fetch/one/${teamEmail}`,
        Headers: undefined,
        body: undefined
    })
}

export async function GetTeamRole(teamEmail) {
    return fetchAPI({
        method: 'GET',
        uri: `/team/fetch/role/${teamEmail}`,
        Headers: {
            'authorization': localStorage.getItem('token')
        },
        body: undefined
    })
}

export async function getMultipleTeams(teamEmails) {
    return fetchAPI({
        method: 'POST',
        uri: '/team/fetch/many',
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teamEmails,
        })
    })
}

export async function getSpecificTeamDetails(teamId) {
    return fetchAPI({
        method: 'GET',
        uri: `/team/fetch/${teamId}/populated`,
        Headers: undefined,
        body: undefined
    })
}

export async function getSpecificTeamsByAccount() {
    return fetchAPI({
        method: 'GET',
        uri: `/team/fetch/teams-by-account`,
        Headers: {
            'authorization': localStorage.getItem('token')
        },
        body: undefined
    });
}

export async function createTeamPost(teamEmail, title, content, bground) {
    return fetchAPI({
        method: 'POST',
        uri: `/team/${teamEmail}/create/post`,
        Headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            title,
            content,
            bground
        })
    })
}

export async function getTeamPostsByTimestamp(teamEmail, timestamp) {
    return fetchAPI({
        method: 'GET',
        uri: `/team/${teamEmail}/fetch/post?date=${timestamp}`,
        Headers: undefined,
        body: undefined
    })
}

export async function getTeamPostsByTimestampDefault(teamEmail) {
    return fetchAPI({
        method: 'GET',
        uri: `/team/${teamEmail}/fetch/post`
    })
}

export async function getAllTeams() {
    return fetchAPI({
        method: 'GET',
        uri: '/team/fetch/all',
        Headers: undefined,
        body: undefined
    })
}

export async function getListTeamInfoByEmails(listEmailTeam) {
    return fetchAPI({
        method: 'POST',
        uri: "/team/get-list-info-team-by-emails",
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            listEmailTeam

        })
    })
}

export async function leaveTeam(teamEmail) {
    return fetchAPI({
        method: 'DELETE',
        uri: `/team/${teamEmail}/leave`,
        Headers: {
            'authorization': localStorage.getItem('token')
        },
        body: undefined
    })
}

export async function toggleFollowTeam(teamEmail) {
    return fetchAPI({
        method: 'POST',
        uri: `/team/${teamEmail}/toggle-follow`,
        Headers: {
            'authorization': localStorage.getItem('token')
        },
    })
}

export async function deleteTeam(teamEmail) {
    return fetchAPI({
        method: 'DELETE',
        uri: `/team/${teamEmail}/delete-team`,
        Headers: {
            'authorization': localStorage.getItem('token')
        },
    })
}