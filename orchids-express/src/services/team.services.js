const { getTeamsCollection, getPostsCollection } = require('../configs/MongoDB');
const { Team } = require('../modules/team.module');
const { Post } = require('../modules/post.module');
const AccountService = require('./account.services');
const { TeamMember } = require('../modules/team.module');

async function getTeam(teamEmail, projection = {}) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection.findOne({ email: teamEmail }, { projection: projection });
    close();
    return result;
}

async function getMultipleTeams(teamEmailList, projection = {}) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection.find({ email: { $in: teamEmailList } }, { projection: projection }).toArray();
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
    }

    return {
        ListEmailTeamOwner: await getMultipleTeams(account.ListEmailTeamOwner || [], projection),
        ListEmailTeamAttend: await getMultipleTeams(account.ListEmailTeamAttend || [], projection)
    };
}

async function getTeamSpecific(teamEmail) {
    const team = await getTeam(teamEmail);

    const teamOwnerDetails = await AccountService.getListUsernameByEmail([team.EmailOwner]);
    const teamMemberDetails = await AccountService.getListUsernameByEmail(team.ListEmailMember.map(member => member.email));

    team.EmailOwner = {
        email: team.EmailOwner,
        details: teamOwnerDetails[0]
    };
    team.ListEmailMember.forEach(member => {
        member.details = teamMemberDetails.find(memberDetails => memberDetails.email === member.email);
    })

    return team;
}

async function createTeam(teamname, description, bground, avatar, creatorEmail) {
    const { collection, close } = await getTeamsCollection();
    const teamToAdd = Team(teamname, description, bground, avatar, creatorEmail); // create new team object

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
                teamname: (teamname || currentTeam.teamname),
                description: (description || currentTeam.description),
                bground: (bground || currentTeam.bground),
                avatar: (avatar || currentTeam.avatar),
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

    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })();
    await AccountService.getAccountInfoByEmail(memberEmail) || (() => { throw new Error(`Account ${memberEmail} does not exist`) })();

    // check if member is already in team
    if (team.ListEmailMember.some(member => member.email === memberEmail)) {
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
    )

    // add team to account
    AccountService.addEmailToTeamAttendList(memberEmail, teamEmail);
    close();

    return result;
}

async function removeMember(teamEmail, memberEmail, caller) {
    if (caller === memberEmail) {
        throw new Error(`Cannot remove yourself`);
    }

    const { collection, close } = await getTeamsCollection();

    // remove the team from account attending
    const result_account = await AccountService.removeEmailFromTeamAttendList(memberEmail, teamEmail);

    // remove the member from team
    const result_team = await collection.updateOne(
        { email: teamEmail },
        { $pull: { "ListEmailMember": { "email": memberEmail } } }
    )

    close();
    return { ...result_account, ...result_team };
}

async function updateMemberRole(teamEmail, memberEmail, role, caller) {

    const { collection, close } = await getTeamsCollection();

    // get database documents
    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })();

    // check if caller is trying to update their own role
    if (caller === memberEmail) {
        throw new Error(`Cannot update your own role`);
    }

    // update the member's role
    const result = await collection.updateOne(
        { email: teamEmail, "ListEmailMember.email": memberEmail },
        { $set: { "ListEmailMember.$.role": role } }
    )

    close();
    return result;
}

async function getAccountRole(accountEmailToGet, teamEmail) {
    const team = await getTeam(teamEmail);
    if (team.EmailOwner === accountEmailToGet) {
        return 'creator'
    }
    const found = team.ListEmailMember.find(member => member.email === accountEmailToGet);
    if (!found) {
        return 'none';
    } else {
        return found.role;
    }
}

async function isRole(role, teamEmail, memberEmail) {
    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })(); // fetch team
    const member = team.ListEmailMember.find(member => member.email === memberEmail); // fetch member from team members. if not found -> undefined
    return member ? member.role === role : false;
}

async function isOwner(teamEmail, memberEmail) {
    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })(); // fetch team
    return team.EmailOwner === memberEmail;
}

async function isMember(teamEmail, memberEmail) {
    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })();
    const member = team.ListEmailMember.find(member => member.email === memberEmail);
    return member ? true : false;
}

async function getMemberSpecific(teamEmail, memberEmail) {
    const team = await getTeam(teamEmail) || (() => { throw new Error(`Team ${teamEmail} does not exist`) })();
    const account = await AccountService.getListUsernameByEmail([memberEmail]) || (() => { throw new Error(`Account ${memberEmail} does not exist`) })();
    const member = team.ListEmailMember.find(member => member.email === memberEmail);
    member.details = account[0];

    return member;
}

async function createTeamPost(title, content, bground, teamEmail) {
    const { collection, close } = await getPostsCollection();
    const postToAdd = Post({ title, content, bground, isTeam: true }, teamEmail); // create new post object
    const result = await collection.insertOne(postToAdd); // add post to database
    close();
    return result
}

async function getTeamPostsByTimestamp(teamEmail, timestamp) {
    const { collection, close } = await getPostsCollection();
    var result;
    if (timestamp) {
        result = await collection.find({ emailCreator: teamEmail, date: { $lt: parseInt(timestamp) } }).sort({ date: -1 }).limit(3).toArray();
    } else {
        result = await collection.find({ emailCreator: teamEmail }).sort({ date: -1 }).limit(3).toArray();
    }
    close();
    return result;
}

async function getAllTeams() {
    const { collection, close } = await getTeamsCollection();
    const result = await collection.find({}, { projection: { _id: 1, teamname: 1, email: 1, EmailOwner: 1, ListEmailFollower: 1, avatar: 1 } }).toArray();
    close();
    return result;
}

async function getListInfoTeamByEmails(listEmails) {
    const { collection, close } = await getTeamsCollection();
    const result = await collection.find({ email: { $in: listEmails } }, { projection: { _id: 1, teamname: 1, email: 1, EmailOwner: 1, ListEmailFollower: 1, avatar: 1 } }).toArray();
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
    getListInfoTeamByEmails
}

// // !test
// async function test() {
//     getListInfoTeamByEmails(['OxSHrR6Uip494@orchids.com']).then(result => console.log(result));
// }

// test();