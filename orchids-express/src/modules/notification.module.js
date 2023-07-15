const { GetPostInfoForLoadPage } = require("../services/post.services");
const { GetQuestionByID } = require("../services/question.services");

module.exports = async function Notification(obj) {
    var from = obj.from;

    if (obj.type === 'comment') {
        var POST = await GetPostInfoForLoadPage(obj.id);
    } else if (obj.type === 'answer') {
        var QUESTION = await GetQuestionByID(obj.id);
    }

    var to = POST?.emailCreator || QUESTION?.creatorEmail;
    var type = obj.type;
    var id = obj.id; // id of post or question

    return {
        from: from,
        to: to,
        type: type,
        id: id,
        date: Date.now(),
        hasSeen: false,
    }
}


