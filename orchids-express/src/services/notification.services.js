const { ObjectId } = require('mongodb');
const { connect, getTeamsCollection } = require('../configs/MongoDB');
const Notification = require('../modules/notification.module');
const { getAccountInfoByEmail } = require('./account.services');
const TeamServices = require('./team.services');

// Create notification for user personl when thier posts are commented or their questions are answered
async function createNotificationToPersonal(from, Id, type) {
    // from : email of user who comment
    // postId : id of post
    var notification = await Notification({
        from: from,
        type: type,
        id: Id
    }, true);
    console.log(notification);
    if (notification.from !== notification.to) {
        const { collection, close } = await connect(
            'orchids-1',
            'notification'
        );
        const result = await collection.insertOne(notification);
        close();
        return result;
    }
}

// create notification for followers when user post
async function createNotificationToFollowers(from, Id, type) {
    const { collection, close } = await connect('orchids-1', 'notification');
    const { collection: collection2, close: close2 } =
        await getTeamsCollection();
    // from : email of user who post
    // postId : id of post
    var listTo = [];
    if (from.includes('@orchids')) {
        var result = await collection2.find({ email: from }).toArray();
        listTo = result[0].ListEmailFollower;
        close2();
    } else {
        console.log('from: ' + from);
        var result = await getAccountInfoByEmail(from);
        listTo = result.ListEmailFollower;
    }

    for (const to of listTo) {
        var notification = {
            from: from,
            to: to,
            type: type,
            id: Id,
            date: Date.now(),
            hasSeen: false
        };
        if (notification.from !== notification.to) {
            await collection.insertOne(notification);
        }
    }
    close();
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
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { hasSeen: true } }
    );
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

// create notification for add user to team
async function createNotificationToTeam(from, to, type) {
    // from : email of user who comment
    // postId : id of post
    var notification = await Notification({
        from: from,
        to: to,
        type: type
    });
    if (notification.from !== notification.to) {
        const { collection, close } = await connect(
            'orchids-1',
            'notification'
        );
        const result = await collection.insertOne(notification);
        close();
        return result;
    }
}

async function createNotificationToTeamAdmins(teamEmail, type, id) {
    const { collection, close } = await getTeamsCollection();

    const team = (await collection.find({ email: teamEmail }).toArray())[0];
    close();
    if (!team) return;
    const members = [
        team.EmailOwner,
        ...team.ListEmailMember.map((member) => member.email)
    ];
    console.log(members);
    members.forEach(async (member) => {
        console.log('Send notification to ' + member);
        const response = await sendNotification(
            team.email,
            member,
            type,
            id,
            false
        );
        console.log(response);
        if (!response) {
            console.log('Error when send notification to ' + member);
        }
    });
}

async function sendNotification(sender, receiver, type, id, allow = true) {
    var notification = await Notification(
        {
            from: sender,
            to: receiver,
            type: type,
            id: id
        },
        allow
    );
    console.log(notification);
    if (notification.from !== notification.to) {
        const { collection, close } = await connect(
            'orchids-1',
            'notification'
        );
        const result = await collection.insertOne(notification);
        close();
        return result;
    }
}

module.exports = {
    createNotificationToPersonal,
    getNotifications,
    setHasSeen,
    deleteNotification,
    createNotificationToFollowers,
    createNotificationToTeam,
    createNotificationToTeamAdmins
};

// // !test
// async  function test() {
//     // const result = await createNotificationToPersonal('a', '5f0e9e4d6a1f6c2f9c0f0c6a', 'comment');
//     // const result = await getNotifications('a');
//     const result = await setHasSeen('64b10d641ed54a8bd5beeeca');
//     console.log(result);
// }

// test();
