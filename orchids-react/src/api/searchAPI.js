import { fetchAPI } from "./templateAPI";

export async function search(keyword) {
    return fetchAPI({
        method: 'GET',
        uri: `/search?query=${keyword}`
    });
}