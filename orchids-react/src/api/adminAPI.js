import { fetchAPI } from "./templateAPI";

// #region FETCHERS

export async function FetchAccountsByPage(page, limit, filter, projection) {
    return fetchAPI({
        method: 'POST',
        uri: '/admin/accounts/page-fetch?page=' + page + '&limit=' + limit,
        Headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            filter, projection
        })
    })
}

export async function FetchPostsByPage(page, limit, filter, projection) {
    return fetchAPI({
        method: 'POST',
        uri: `/admin/posts/page-fetch?page=${page}&limit=${limit}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            filter,
            projection
        })
    })
}

export async function FetchTeamsByPage(page, limit, filter, projection) {
    return fetchAPI({
        method: 'POST',
        uri: `/admin/teams/page-fetch?page=${page}&limit=${limit}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            filter,
            projection
        })
    })
}

export async function FetchQuestionsByPage(page, limit, filter, projection) {
    return fetchAPI({
        method: 'POST',
        uri: `/admin/questions/page-fetch?page=${page}&limit=${limit}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            filter,
            projection
        })
    })
}

// #endregion

export async function GetAccountsStats() {
    return fetchAPI({
        method: 'GET',
        uri: '/admin/accounts/stats',
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function GetOneAccount(email) {
    console.log(email);
    return fetchAPI({
        method: 'GET',
        uri: `/admin/accounts/${email}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function ToggleAdmin(email, value) {
    return fetchAPI({
        method: 'POST',
        uri: `/admin/account/${email}/admin?value=${value}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function ToggleDeactivateAccount(accountEmail) {
    return fetchAPI({
        method: 'POST',
        uri: `/admin/account/${accountEmail}/deactivate`,
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function GetPostsStats() {
    return fetchAPI({
        method: 'GET',
        uri: '/admin/post/stats',
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function GetOnePost(id) {
    return fetchAPI({
        method: 'GET',
        uri: `/admin/post/${id}`,
        Headers: {
            'authorization': localStorage.getItem('token'),
        }
    })
}

export async function GetOneQuestion(id) {
    return fetchAPI({
        method: 'GET',
        uri: `/admin/question/${id}`,
        Headers: {
            'authorization': localStorage.getItem('token')
        }
    })
}

export async function GetQuestionsStats() {
    return fetchAPI({
        method: 'GET',
        uri: `/admin/questions/stats`,
        Headers: {
            'authorization': localStorage.getItem("token")
        }
    })
}