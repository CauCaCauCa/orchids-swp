import { fetchAPI } from "./templateAPI";


// !Region Account functions _ non-require token
// TODO: get list question by time default
export async function GetListQuestionByTimeDefault() {
    return fetchAPI({
        method: 'GET',
        uri: '/question/get-list-question-by-time',
    });
}
// TODO: get list question by time
export async function GetListQuestionByTime(time) {
    return fetchAPI({
        method: 'GET',
        uri: '/question/get-list-question-by-time?time=' + time,
    });
}

// TODO: get question by id
export async function GetQuestionByID(questionID) {
    return fetchAPI({
        method: 'GET',
        uri: '/question/get-question-by-id?questionID=' + questionID,
    });
}


// !Region Account functions _ require token
// TODO: create question
export async function CreateQuestion(image, content) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'POST',
            uri: '/question/create',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                image: image,
                content: content
            })
        });
    }
    return null;
}
// TODO: delete question
export async function DeleteQuestion(questionId) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'DELETE',
            uri: '/question/delete',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                questionId: questionId,
            })
        });
    }
    return null;
}

// TODO: answer question
export async function AnswerQuestion(questionID, content, date) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'POST',
            uri: '/question/answer',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                questionID: questionID,
                content: content,
                date: date
            })
        });
    }
    return {acknowledged: false};
}

// TODO: delete answer
export async function DeleteAnswer(questionID, createDate) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'DELETE',
            uri: '/question/delete-answer',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                questionID: questionID,
                createDate: createDate
            })
        });
    }
    return null;
}

// TODO: Like answer
export async function LikeAnswer(questionID, emailCreator, createDate) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'POST',
            uri: '/question/like-answer',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                questionID: questionID,
                emailCreator: emailCreator,
                createDate: createDate
            })
        });
    }
    return null;
}

// TODO: Unlike answer
export async function UnlikeAnswer(questionID, emailCreator, createDate) {
    if (!localStorage.getItem('token')) {
        alert('Bạn chưa đăng nhập!');
    } else {
        return fetchAPI({
            method: 'POST',
            uri: '/question/unlike-answer',
            Headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                questionID: questionID,
                emailCreator: emailCreator,
                createDate: createDate
            })
        });
    }
    return null;
}
