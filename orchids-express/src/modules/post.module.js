function Post(obj, emailCreator) {
    var emailCreator = emailCreator // could be have teamId(email team random)
    var title = obj.title
    var content = obj.content
    var bground = obj.bground || 'https://cdn.vuanem.com/blog/wp-content/uploads/2022/11/y-nghia-hoa-phong-lan.jpg'
    var date = Date.now()
    var ListEmailLiked = [] // list of user id like post
    var ListComment = [] // list of comment
    var isTeam = obj.isTeam || false

    return {
        emailCreator,
        title,
        content,
        bground,
        date,
        ListEmailLiked,
        ListComment,
        isTeam
    }
}

function Comment(content, email) {
    var content = content
    var date = Date.now()
    var email = email
    var ListEmailLiked = [] // list of user id like post

    return {
        content,
        date,
        email,
        ListEmailLiked
    }
}

module.exports = {
    Post,
    Comment
}
