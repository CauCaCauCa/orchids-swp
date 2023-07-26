const {
    getTeamsCollection,
    getPostsCollection,
    getAccountsCollection,
    connect
} = require('../configs/MongoDB');
const { Team } = require('../modules/team.module');
const { Post } = require('../modules/post.module');
const AccountService = require('./account.services');
const PostService = require('./post.services');
const { TeamMember } = require('../modules/team.module');
const { ObjectId } = require('mongodb');

async function getTeam(teamEmail, projection = {}) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection.findOne(
        { email: teamEmail },
        { projection: projection }
    );
    close();
    return result;
}

async function getMultipleTeams(teamEmailList, projection = {}) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection
        .find({ email: { $in: teamEmailList } }, { projection: projection })
        .toArray();
    close();
    return result;
}

async function getTeamSpecificByAccount(accountEmail) {
    const account = await AccountService.getAccountInfoByEmail(accountEmail); // fetch current account
    const projection = {
        _id: 1,
        email: 1,
        teamname: 1,
        avatar: 1,
        description: 1
    };

    return {
        ListEmailTeamOwner: await getMultipleTeams(
            account.ListEmailTeamOwner || [],
            projection
        ),
        ListEmailTeamAttend: await getMultipleTeams(
            account.ListEmailTeamAttend || [],
            projection
        )
    };
}

async function getTeamSpecific(teamEmail) {
    const team = await getTeam(teamEmail);

    const teamOwnerDetails = await AccountService.getListUsernameByEmail([
        team.EmailOwner
    ]);
    const teamMemberDetails = await AccountService.getListUsernameByEmail(
        team.ListEmailMember.map((member) => member.email)
    );

    team.EmailOwner = {
        email: team.EmailOwner,
        details: teamOwnerDetails[0]
    };
    team.ListEmailMember.forEach((member) => {
        member.details = teamMemberDetails.find(
            (memberDetails) => memberDetails.email === member.email
        );
    });

    return team;
}

async function createTeam(
    teamname,
    description,
    bground,
    avatar,
    creatorEmail
) {
    const { collection, close } = await getTeamsCollection();
    const teamToAdd = Team(
        teamname,
        description,
        bground,
        avatar,
        creatorEmail
    ); // create new team object

    await collection.insertOne(teamToAdd); // add team to database
    await AccountService.addEmailToTeamOwnerList(creatorEmail, teamToAdd.email); // add team to account ownership

    close();
    return { insertedEmail: teamToAdd.email, acknowledged: true };
}

async function updateTeam(teamEmail, teamname, description, bground, avatar) {
    const { collection, close } = await getTeamsCollection();
    const currentTeam = await getTeam(teamEmail);
    const result = await collection.updateOne(
        { email: teamEmail },
        {
            $set: {
                teamname: teamname || currentTeam.teamname,
                description: description || currentTeam.description,
                bground: bground || currentTeam.bground,
                avatar: avatar || currentTeam.avatar
            }
        }
    );

    close();
    return result;
}

async function deleteTeam(teamEmail, creatorEmail) {
    const { collection, close } = await getTeamsCollection();

    const result = await collection.deleteOne({ email: teamEmail });
    await AccountService.removeEmailFromTeamOwnerList(creatorEmail, teamEmail);

    close();
    return result;
}

async function addMember(teamEmail, memberEmail, role) {
    const { collection, close } = await getTeamsCollection();

    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })();
    (await AccountService.getAccountInfoByEmail(memberEmail)) ||
        (() => {
            throw new Error(`Account ${memberEmail} does not exist`);
        })();

    // check if member is already in team
    if (team.ListEmailMember.some((member) => member.email === memberEmail)) {
        throw new Error(`${memberEmail} is already a member of ${teamEmail}`);
    }
    // check if member is owner
    if (team.EmailOwner === memberEmail) {
        throw new Error(`${memberEmail} is the owner of ${teamEmail}`);
    }

    const newMember = TeamMember(role, memberEmail);

    // update team
    const result = await collection.updateOne(
        { email: teamEmail },
        { $addToSet: { ListEmailMember: newMember } }
    );

    // add team to account
    AccountService.addEmailToTeamAttendList(memberEmail, teamEmail);
    close();

    await notifyAccountAddToTeamMember(teamEmail, memberEmail, role);

    return result;
}

async function removeMember(teamEmail, memberEmail, caller) {
    if (caller === memberEmail) {
        throw new Error(`Cannot remove yourself`);
    }

    const { collection, close } = await getTeamsCollection();

    // remove the team from account attending
    const result_account = await AccountService.removeEmailFromTeamAttendList(
        memberEmail,
        teamEmail
    );

    // remove the member from team
    const result_team = await collection.updateOne(
        { email: teamEmail },
        { $pull: { ListEmailMember: { email: memberEmail } } }
    );

    close();
    return { ...result_account, ...result_team };
}

async function updateMemberRole(teamEmail, memberEmail, role, caller) {
    const { collection, close } = await getTeamsCollection();

    // get database documents
    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })();

    // check if caller is trying to update their own role
    if (caller === memberEmail) {
        throw new Error(`Cannot update your own role`);
    }

    // update the member's role
    const result = await collection.updateOne(
        { email: teamEmail, 'ListEmailMember.email': memberEmail },
        { $set: { 'ListEmailMember.$.role': role } }
    );

    close();

    notifyAccountUpdateRole(teamEmail, memberEmail, role);

    return result;
}

async function getAccountRole(accountEmailToGet, teamEmail) {
    const team = await getTeam(teamEmail);
    if (team.EmailOwner === accountEmailToGet) {
        return 'creator';
    }
    const found = team.ListEmailMember.find(
        (member) => member.email === accountEmailToGet
    );
    if (!found) {
        return 'none';
    } else {
        return found.role;
    }
}

async function isRole(role, teamEmail, memberEmail) {
    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })(); // fetch team
    const member = team.ListEmailMember.find(
        (member) => member.email === memberEmail
    ); // fetch member from team members. if not found -> undefined
    return member ? member.role === role : false;
}

async function isOwner(teamEmail, memberEmail) {
    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })(); // fetch team
    return team.EmailOwner === memberEmail;
}

async function isMember(teamEmail, memberEmail) {
    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })();
    const member = team.ListEmailMember.find(
        (member) => member.email === memberEmail
    );
    return member ? true : false;
}

async function getMemberSpecific(teamEmail, memberEmail) {
    const team =
        (await getTeam(teamEmail)) ||
        (() => {
            throw new Error(`Team ${teamEmail} does not exist`);
        })();
    const account =
        (await AccountService.getListUsernameByEmail([memberEmail])) ||
        (() => {
            throw new Error(`Account ${memberEmail} does not exist`);
        })();
    const member = team.ListEmailMember.find(
        (member) => member.email === memberEmail
    );
    member.details = account[0];

    return member;
}

async function createTeamPost(title, content, bground, teamEmail) {
    const { collection: teamCollection, close: clostTeam } =
        await getTeamsCollection();
    const { collection: postCollection, close: closePost } =
        await getPostsCollection();

    const postToAdd = Post(
        { title, content, bground, isTeam: true },
        teamEmail
    ); // create new post object
    const result = await postCollection.insertOne(postToAdd); // add post to database
    const response = await postCollection
        .find({ _id: result.insertedId })
        .toArray(); // fetch post from database

    await teamCollection.updateOne(
        { email: teamEmail },
        { $inc: { NumberPost: 1 } }
    );

    closePost();
    // NOTIFY FOLLOWERS
    const team = await getTeam(teamEmail);
    clostTeam();
    await createNotificationToFollowers(
        team.email,
        result.insertedId,
        'has a new post'
    );

    return response[0];
}

async function getTeamPostsByTimestamp(teamEmail, timestamp) {
    const { collection, close } = await getPostsCollection();
    var result;
    if (timestamp) {
        result = await collection
            .find({
                emailCreator: teamEmail,
                date: { $lt: parseInt(timestamp) }
            })
            .sort({ date: -1 })
            .limit(3)
            .toArray();
    } else {
        result = await collection
            .find({ emailCreator: teamEmail })
            .sort({ date: -1 })
            .limit(3)
            .toArray();
    }
    close();
    return result;
}

async function getAllTeams() {
    const { collection, close } = await getTeamsCollection();
    const result = await collection
        .find(
            {},
            {
                projection: {
                    _id: 1,
                    teamname: 1,
                    email: 1,
                    EmailOwner: 1,
                    ListEmailFollower: 1,
                    avatar: 1
                }
            }
        )
        .toArray();
    close();
    return result;
}

async function getListInfoTeamByEmails(listEmails) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection
        .find(
            { email: { $in: listEmails } },
            {
                projection: {
                    _id: 1,
                    teamname: 1,
                    email: 1,
                    EmailOwner: 1,
                    ListEmailFollower: 1,
                    avatar: 1
                }
            }
        )
        .toArray();
    close();
    return result;
}

async function toggleFollowTeam(followerEmail, teamEmail) {
    const { collection, close } = await getTeamsCollection();
    const { collection: accountCollection, close: closeAccountCollection } =
        await getAccountsCollection();
    const team = await getTeam(teamEmail);
    if (!team) {
        throw new Error(`Team ${teamEmail} does not exist`);
    }

    const isFollowing = team.ListEmailFollower.includes(followerEmail);
    var result;
    if (isFollowing) {
        result = await collection.updateOne(
            { email: teamEmail },
            { $pull: { ListEmailFollower: followerEmail } }
        );
        await accountCollection.updateOne(
            { email: followerEmail },
            { $pull: { ListEmailFollowing: teamEmail } }
        );
    } else {
        result = await collection.updateOne(
            { email: teamEmail },
            { $push: { ListEmailFollower: followerEmail } }
        );
        await accountCollection.updateOne(
            { email: followerEmail },
            { $push: { ListEmailFollowing: teamEmail } }
        );
    }
    close();
    return {
        follower: followerEmail,
        team: teamEmail,
        isFollowing: !isFollowing,
        ...result
    };
}

async function leaveTeam(teamEmail, memberEmail) {
    const { collection, close } = await getTeamsCollection();

    // remove the team from account attending
    const result_account = await AccountService.removeEmailFromTeamAttendList(
        memberEmail,
        teamEmail
    );

    // remove the member from team
    const result_team = await collection.updateOne(
        { email: teamEmail },
        { $pull: { ListEmailMember: { email: memberEmail } } }
    );

    close();
    return { ...result_account, ...result_team };
}

async function deleteTeam(teamEmail) {
    const { collection, close } = await getTeamsCollection();

    const team = (await collection.find({ email: teamEmail }).toArray())[0];

    const members = team.ListEmailMember;
    var count = 0;
    members.forEach(async (member) => {
        await AccountService.removeEmailFromTeamAttendList(
            member.email,
            teamEmail
        );
        count++;
    });

    console.log(count);

    const owner = team.EmailOwner;
    const teamOwnerResponse = await AccountService.removeEmailFromTeamOwnerList(
        owner,
        teamEmail
    );
    console.log(teamOwnerResponse);

    const followers = team.ListEmailFollower;
    count = 0;
    await followers.forEach(async (follower) => {
        await AccountService.removeEmailFromFollowingList(follower, teamEmail);
        count++;
    });
    console.log(count);

    const postResponse = await deleteAllPostsByTeam(teamEmail);
    console.log(postResponse);

    const response = await collection.deleteOne({ email: teamEmail });

    close();
    return response;
}

async function deleteTeamPost(postId, teamEmail, callerEmail) {
    const { collection, close } = await getTeamsCollection();
    const { collection: postCollection, close: closePost } =
        await getPostsCollection();
    if (!isMember(teamEmail, callerEmail) || !isOwner(teamEmail, callerEmail)) {
        throw new Error('You are not the creator of this post');
    }

    // delete post
    await postCollection.deleteOne({
        _id: new ObjectId(postId)
    });
    closePost();

    // subtract number of posts from team
    const response = collection.updateOne(
        { email: teamEmail },
        { $inc: { NumberPost: -1 } }
    );

    close();
    return response;
}

async function getTopTeams(count) {
    const { collection, close } = await getTeamsCollection();
    const limit = Number(count);
    const result = await collection
        .aggregate([
            {
                $addFields: {
                    listSize: { $size: '$ListEmailFollower' }
                }
            },
            {
                $sort: { listSize: -1 }
            },
            {
                $limit: limit
            }
        ])
        .toArray();

    close();
    return result;
}

module.exports = {
    getTeam,
    getMultipleTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    updateMemberRole,
    isRole,
    isOwner,
    isMember,
    getTeamSpecificByAccount,
    getAccountRole,
    createTeamPost,
    getTeamSpecific,
    getMemberSpecific,
    getTeamPostsByTimestamp,
    getAllTeams,
    getListInfoTeamByEmails,
    followTeam: toggleFollowTeam,
    leaveTeam,
    deleteTeamPost,
    getTopTeams
};

// // !test
// async function test() {
//     getListInfoTeamByEmails(['OxSHrR6Uip494@orchids.com']).then(result => console.log(result));
// }

// test();

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

async function deleteAllPostsByTeam(teamEmail) {
    const { collection, close } = await getPostsCollection();
    const result = await collection.deleteMany({ emailCreator: teamEmail });
    close();
    return result;
}

async function notifyAccountAddToTeamMember(from, to, role) {
    const { collection, close } = await connect('orchids-1', 'notification');

    var notification = {
        from: from,
        to: to,
        type: 'teamMember',
        id: role,
        date: Date.now(),
        hasSeen: false
    };
    if (notification.from !== notification.to) {
        await collection.insertOne(notification);
    }

    close();
}

async function notifyAccountUpdateRole(from, to, role) {
    const { collection, close } = await connect('orchids-1', 'notification');

    var notification = {
        from: from,
        to: to,
        type: 'teamRole',
        id: role,
        date: Date.now(),
        hasSeen: false
    };
    if (notification.from !== notification.to) {
        await collection.insertOne(notification);
    }

    close();
}
