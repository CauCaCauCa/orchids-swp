function Question(image, content, email) {
    // var content = object.content
    // var image = object.image
    var createDate = Date.now()
    var creatorEmail = email
    var answers = []

    return {
        content,
        image,
        createDate,
        creatorEmail,
        answers
    }
}

function Answer(object, email) {
    var content = object.content
    var emailCreator = email
    var createDate = object.createDate || Date.now()
    var likes = [] // email of user like this answer

    return {
        content,
        emailCreator,
        createDate,
        likes
    }
}

module.exports = { Question, Answer }