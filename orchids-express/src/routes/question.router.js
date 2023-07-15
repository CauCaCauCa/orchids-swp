const express = require('express')
const router = express.Router()
const LogAuth = require('../middlewares/authentication.middleware')
const QuestionServices = require('../services/question.services')
const AccountServices = require('../services/account.services')
const Logger = require('../utils/Logger')
const { createNotificationToPersonal } = require('../services/notification.services')

router.all('', async (req, res) => {
    res.send('Welcome to the Question router!');
})

// get question by id
router.get('/get-question-by-id', async (req, res) => {
    var id = req.query.questionID;
    var result = await QuestionServices.GetQuestionByID(id);
    var user = await AccountServices.getAccountInfoByEmail(result.creatorEmail, { username: 1 });
    result.username = user.username;
    result.avatar = user.avatar;
    res.send(result)
})


// create question
router.post('/create', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var content = req.body.content;
    var image = req.body.image;
    var result = await QuestionServices.CreateQuestion(image, content, email)
    await AccountServices.updateNumberQuestionInc(email)
    res.send(result)
})
// delete question
router.delete('/delete', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var id = req.body.questionId;
    var result = await QuestionServices.DeleteQuestion(id, email)
    await AccountServices.updateNumberQuestionDes(email)
    res.send(result)
})

// get list question by time
router.get('/get-list-question-by-time', async (req, res) => {
    var time = req.query.time;
    var result = await QuestionServices.GetListQuestionByTime(time);
    // console.log(result);
    // get username and avatar by email
    for (let i = 0; i < result.length; i++) {
        var user = await AccountServices.getAccountInfoByEmail(result[i].creatorEmail, { username: 1 });
        result[i].username = user.username;
        result[i].avatar = user.avatar;
    }
    res.send(result)
})

// answer question
router.post('/answer', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var questionID = req.body.questionID;
    var content = req.body.content;
    var date = req.body.date;
    var result = await QuestionServices.AnswerQuestion(questionID, content, date, email);
    await createNotificationToPersonal(email, questionID, 'answer');
    res.send(result)
})

// delete answer
router.delete('/delete-answer', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var questionID = req.body.questionID;
    var createDate = req.body.createDate;
    var result = await QuestionServices.DeleteAnswer(questionID, createDate, email)
    res.send(result)
})

// like answer
router.post('/like-answer', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var questionID = req.body.questionID;
    var emailCreator = req.body.emailCreator;
    var createDate = req.body.createDate;
    var result = await QuestionServices.LikeAnswer(questionID, createDate, emailCreator, email);
    res.send(result);
})

// unlike answer
router.post('/unlike-answer', LogAuth.CheckTimeoutToken, async (req, res) => {
    const email = LogAuth.decodeToken(req.headers['authorization']).email;
    var questionID = req.body.questionID;
    var emailCreator = req.body.emailCreator;
    var createDate = req.body.createDate;
    var result = await QuestionServices.UnlikeAnswer(questionID, createDate, emailCreator, email);
    res.send(result);
})



module.exports = router