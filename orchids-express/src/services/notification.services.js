const { ObjectId } = require('mongodb');
const { connect } = require('../configs/MongoDB');
const Notification = require('../modules/notification.module');

// Create notification for user personl when thier posts are commented or their questions are answered
async function createNotificationToPersonal(from, Id, type) {
    // from : email of user who comment
    // postId : id of post
    var notification = await Notification({
        from: from,
        type: type,
        id: Id,
    });
    if (notification.from !== notification.to) {
        const { collection, close } = await connect('orchids-1', 'notification');
        const result = await collection.insertOne(notification);
        close();
        return result;
    }
}

// get all notifications of user
async function getNotifications(email) {
    const { collection, close } = await connect('orchids-1', 'notification');
    const result = await collection.find({ to: email }).toArray();
    close();
    return result;
}

// set hasSeen = true
async function setHasSeen(id) {
    const { collection, close } = await connect('orchids-1', 'notification');
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { hasSeen: true } });
    close();
    return result;
}

// delete notification
async function deleteNotification(id) {
    const { collection, close } = await connect('orchids-1', 'notification');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    close();
    return result;
}


module.exports = {
    createNotificationToPersonal,
    getNotifications,
    setHasSeen,
    deleteNotification,
}


// // !test
// async  function test() {
//     // const result = await createNotificationToPersonal('a', '5f0e9e4d6a1f6c2f9c0f0c6a', 'comment');
//     // const result = await getNotifications('a');
//     const result = await setHasSeen('64b10d641ed54a8bd5beeeca');
//     console.log(result);
// }

// test();