const random = require('../utils/RadomString');


module.exports = function Account(obj) {
    var email = obj.email
    var username = obj.username || "user" + random.randomString(4)
    var avatar = obj.avatar || ""
    var bground = ""
    var role = "US"
    var status = "true"
    var created_at = Date.now()
    var ListEmailFollower = []
    var ListEmailFollowing = []
    var numberPost = 0
    var numberQuestion = 0
    var ListEmailTeamOwner = []
    var ListEmailTeamAttend = []

    return {
        email,
        username,
        avatar,
        bground,
        role,
        status,
        created_at,
        ListEmailFollower,
        ListEmailFollowing,
        numberPost,
        numberQuestion,
        ListEmailTeamOwner,
        ListEmailTeamAttend,
    }
}


// console.log(Account({ email: "tiennt@gmail.com" }));
