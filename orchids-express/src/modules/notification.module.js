const { ObjectId } = require('mongodb');
const { getPostsCollection } = require('../configs/MongoDB');
const { GetPostInfoForLoadPage } = require('../services/post.services');
const { GetQuestionByID } = require('../services/question.services');

// allow is a flag. If allow is true, then we'll allow this module to fetch data
// THIS IS USED FOR THE SEND NOTIFICATION TO TEAM ADMINS FUNCTION. DO NOT REMOVE THE ALLOW PARAMETER
module.exports = async function Notification(obj, allow = true) {
    var from = obj.from;
    var to;
    if (allow) {
        if (obj.type === 'comment') {
            const { collection, close } = await getPostsCollection();
            var POST = await collection.findOne({ _id: new ObjectId(obj.id) });
            close();
            // var POST = await GetPostInfoForLoadPage(obj.id);
        } else if (obj.type === 'answer') {
            var QUESTION = await GetQuestionByID(obj.id);
        }
        to = POST?.emailCreator || QUESTION?.creatorEmail;
    }
    
    to = obj.to;
    var type = obj.type;
    var id = obj.id; // id of post or question

    return {
        from: from,
        to: to,
        type: type,
        id: id,
        date: Date.now(),
        hasSeen: false
    };
};
