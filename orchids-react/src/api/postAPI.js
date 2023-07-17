import { useContext } from "react";
import { fetchAPI } from "./templateAPI";

// !Region Post functions _ non-require token
// TODO: Get post by postId.
export async function GetPostById(postId) {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-post',
        body: JSON.stringify({
            "postId": postId
        })
    });
}
// TODO: get list post by time but default.
export async function GetListPostByTimeDefault() {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-list-by-time',
    });
}
// TODO: get list post by time
export async function GetListPostByTime(date) {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-list-by-time?date=' + date,
    });
}
// TODO: get list post by time and emailCreator default.
export async function GetListPostByTimeAndEmailCreatorDefault(emailCreator) {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-list-by-time-and-email-creator?emailCreator=' + emailCreator,
    });
}
// TODO: get list post by time and emailCreator
export async function GetListPostByTimeAndEmailCreator(date, emailCreator) {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-list-by-time-and-email-creator?date=' + date + '&emailCreator=' + emailCreator,
    });
}
// TODO: get Post info for load Page Post.
export async function GetPostInfo(postId) {
    return fetchAPI({
        method: 'GET',
        uri: '/post/get-post-info?postId=' + postId,
    });
}

// !Region Post functions _ require token
// TODO: Create post.
export async function CreatePost(title, content, bground) {
    return fetchAPI({
        method: 'POST',
        uri: '/post/create',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "title": title,
            "content": content,
            "bground": bground
        })
    });
}
// TODO: Update post.
export async function UpdatePost(postId, title, content, bground) {
    return fetchAPI({
        method: 'PUT',
        uri: '/post/update-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "postId": postId,
            "title": title,
            "content": content,
            "bground": bground
        })
    });
}
// TODO: Delete post.
export async function DeletePost(postId) {
    return fetchAPI({
        method: 'DELETE',
        uri: '/post/delete-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            "postId": postId
        })
    });
}

// TODO: like post.
export async function LikePost(postId) {

    if (!localStorage.getItem('token')) {
        // alert('You must login to like post!');
        return { msg: 'You must login to like post!' };
    }
    return fetchAPI({
        method: 'PUT',
        uri: '/post/like-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user like post
        },
        body: JSON.stringify({
            "postId": postId,
        })
    });
}
// TODO: unlike post.
export async function UnlikePost(postId) {
    if (!localStorage.getItem('token')) {
        // alert('You must login to unlike post!');
        return { msg: 'You must login to unlike post!' };
    }
    return fetchAPI({
        method: 'PUT',
        uri: '/post/unlike-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user unlike post
        },
        body: JSON.stringify({
            "postId": postId,
        })
    });
}
// TODO: comment post.
export async function CommentPost(postId, content) {
    if (!localStorage.getItem('token')) {
        // alert('You must login to comment post!');
        return { msg: 'You must login to comment post!' };
    }
    return fetchAPI({
        method: 'PUT',
        uri: '/post/comment-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user comment post
        },
        body: JSON.stringify({
            "postId": postId,
            "content": content
        })
    });
}
// TODO: delete comment post.
export async function DeleteCommentPost(postId, date) {
    return fetchAPI({
        method: 'PUT',
        uri: '/post/delete-comment-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user delete comment post
        },
        body: JSON.stringify({
            "postId": postId,
            "date": date,
            "email": localStorage.getItem('email')
        })
    });
}

// like comment post.
export async function LikeCommentPost(postId, date, emailCommentor) {
    if (!localStorage.getItem('token')) {
        // alert('You must login to like comment post!');
        return { msg: 'You must login to like comment post!' };
    }
    return fetchAPI({
        method: 'PUT',
        uri: '/post/like-comment-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user like comment post
        },
        body: JSON.stringify({
            "postId": postId,
            "date": date,
            "emailCommentor": emailCommentor,
        })
    });
}

// unlike comment post.
export async function UnlikeCommentPost(postId, date, emailCommentor) {
    if (!localStorage.getItem('token')) {
        // alert('You must login to unlike comment post!');
        return { msg: 'You must login to unlike comment post!' };
    }
    return fetchAPI({
        method: 'PUT',
        uri: '/post/unlike-comment-post',
        Headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') // user unlike comment post
        },
        body: JSON.stringify({
            "postId": postId,
            "date": date,
            "emailCommentor": emailCommentor,
        })
    });
}