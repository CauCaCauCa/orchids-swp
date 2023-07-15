import { fetchAPI } from "./templateAPI";


// #region Account functions _ non-require token

// TODO: Get personal info.
export async function GetPersonalInfo(username) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-account-info-by-username?username=' + username,
    });
}
// TODO: Get post list by username.
export async function GetPostList(username) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-post-list',
        body: JSON.stringify({
            "username": username
        })
    });
}
// TODO: Get question list by username.
export async function GetQuestionList(username) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-question-list',
        body: JSON.stringify({
            "username": username
        })
    });
}
// TODO: Get followers list by username.
export async function GetFollowersList(username) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-followers-list',
        body: JSON.stringify({
            "username": username
        })
    });
}
// TODO: Get following list by username.
export async function GetFollowingList(username) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-following-list',
        body: JSON.stringify({
            "username": username
        })
    });
}
// TODO: get list username by emails
export async function GetListUsernameByEmails(emails) {
    return fetchAPI({
        method: 'POST',
        uri: '/account/get-list-username-by-emails',
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "emails": emails
        })
    });
}

// #endregion

// !Region Account functions _ require token
// TODO: Get personal info.
export async function GetPersonalInfoToken(token) {
    return fetchAPI({
        method: 'GET',
        uri: '/account/get-account-info',
        Headers: {
            'Authorization': token
        }
    });
}
// TODO: Update username.
export async function UpdateUsername(username) {
    return fetchAPI({
        method: 'PUT',
        uri: '/account/update-username',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "username": username
        })
    });
}
// TODO: Update bground.
export async function UpdateBackground(background) {
    return fetchAPI({
        method: 'PUT',
        uri: '/account/update-bground',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "bground": background.toString()
        })
    });
}

// TODO: follow user.
export async function FollowUser(email) {
    return fetchAPI({
        method: 'PUT',
        uri: '/account/follow-user',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "emailDes": email
        })
    });
}

// TODO: unfollow user.
export async function UnfollowUser(email) {
    return fetchAPI({
        method: 'PUT',
        uri: '/account/unfollow-user',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "emailDes": email
        })
    });
}
