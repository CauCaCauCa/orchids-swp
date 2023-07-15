const random = require('../utils/RadomString')

function Team(teamname_, description_, bground_, avatar_, creatorObject) {
    var email = random.randomEmailForTeam();
    var teamname = teamname_ || "";
    var description = description_ || "";
    var bground = bground_ || "";
    var avatar = avatar_ || "";
    var create_at = Date.now();
    var EmailOwner = creatorObject;
    var ListEmailMember = []; // email of members
    var ListEmailFollower = []; // email of followers
    var NumberPost = 0;

    return {
        email,
        teamname,
        description,
        bground,
        avatar,
        create_at,
        EmailOwner,
        ListEmailMember,
        ListEmailFollower,
        NumberPost
    }
}

function TeamMember(role, memberEmail) {
    var email = memberEmail;
    var role = role || "writer"; // can be writer, admin
    var create_at = Date.now();

    return {
        email,
        role,
        create_at
    }
}

module.exports = { Team, TeamMember };