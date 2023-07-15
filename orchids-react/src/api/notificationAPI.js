import { fetchAPI } from "./templateAPI";

// TODO: Get personal notifications
export async function getNotifications() {
    return fetchAPI({
        method: 'GET',
        Headers: {
            'Authorization': localStorage.getItem('token')
        },
        uri: '/notification',
    });
}

// TODO: Set hasSeen = true
export async function setHasSeen(id) {
    return fetchAPI({
        method: 'PUT',
        Headers: {
            'Content-Type': 'application/json',
        },
        uri: '/notification',
        body: JSON.stringify({
            id: id,
        }),
    });
}

// TODO: delete notification
export async function deleteNotification(id) {
    return fetchAPI({
        method: 'DELETE',
        Headers: {
            'Content-Type': 'application/json',
        },
        uri: '/notification',
        body: JSON.stringify({
            id: id,
        }),
    });
}