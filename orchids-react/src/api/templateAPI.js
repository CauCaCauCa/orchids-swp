
const domain = 'http://localhost:8000';

export async function fetchAPI(caller) {
    return fetch(domain + caller.uri, {
        method: caller.method,
        headers: caller.Headers,
        body: caller.body
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log('Error: ', error);
        });  
}
