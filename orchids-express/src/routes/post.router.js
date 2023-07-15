const express = require('express');
const router = express.Router();
const PostServices = require('../services/post.services');
const AccountServices = require('../services/account.services');
const TeamServices = require('../services/team.services');
const logAuth = require('../middlewares/authentication.middleware');
const { createNotificationToPersonal } = require('../services/notification.services');


// TODO: create post - require token
router.post('/create', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const emailCreator = logAuth.decodeToken(token).email;
    var post = req.body;
    var result = await PostServices.CreatePost(post, emailCreator);
    await AccountServices.updateNumberPost(emailCreator);
    res.send(result);
});
// TODO: delete post - require token
router.delete('/delete-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const emailCreator = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var result = await PostServices.DeletePost(postId, emailCreator);
    await AccountServices.updateNumberPostDes(emailCreator);
    res.send(result);
});
// TODO: update post - require token
router.put('/update-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const emailCreator = logAuth.decodeToken(token).email;
    var post = req.body;
    var result = await PostServices.UpdatePost(post, emailCreator);
    res.send(result);
});
// TODO: get list post by time
router.get('/get-list-by-time', async (req, res) => {
    var timestamp = req.query.date;
    var result = await PostServices.GetListPostByTime(timestamp);
    // user username by email
    for (let i = 0; i < result.length; i++) {
        if (result[i].isTeam == false) {
            var user = await AccountServices.getAccountInfoByEmail(result[i].emailCreator, { username: 1 });
            // console.log(user);
            if (user) {
                result[i].username = user.username;
                result[i].avatar = user.avatar;
            }
        } else {
            var team = await TeamServices.getTeam(result[i].emailCreator, { teamname: 1, avatar: 1 });
            // console.log(team);
            if (team) {
                result[i].username = team.teamname;
                result[i].avatar = team.avatar;
            }
        }
    }

    res.send(result);
});
// TODO: get list post by time and emailCreator
router.get('/get-list-by-time-and-email-creator', async (req, res) => {
    var timestamp = req.query.date;
    var emailCreator = req.query.emailCreator;
    var result = await PostServices.GetListPostByTimeAndEmailCreator(timestamp, emailCreator);
    // user username by email
    for (let i = 0; i < result.length; i++) {
        if (result[i].isTeam == false) {
            var user = await AccountServices.getAccountInfoByEmail(result[i].emailCreator, { username: 1 });
            // console.log(user);
            if (user) {
                result[i].username = user.username;
                result[i].avatar = user.avatar;
            }
        } else {
            var team = await TeamServices.getTeam(result[i].emailCreator, { teamname: 1, avatar: 1 });
            // console.log(team);
            if (team) {
                result[i].username = team.teamname;
                result[i].avatar = team.avatar;
            }
        }
    }
    res.send(result);
});
// TODO: get Post info for load Page Post.
router.get('/get-post-info', async (req, res) => {
    var postId = req.query.postId;
    var result = await PostServices.GetPostInfoForLoadPage(postId);
    if (result.isTeam == false) {
        // user username by email
        var user = await AccountServices.getAccountInfoByEmail(result.emailCreator, { username: 1, avatar: 1 });
        result.username = user.username;
        result.avatar = user.avatar;
        res.send(result);
    } else {
        // team username by email
        var team = await TeamServices.getTeam(result.emailCreator, { teamname: 1, avatar: 1 });
        result.username = team.teamname;
        result.avatar = team.avatar;
        res.send(result);
    }
});
// TODO: like post
router.put('/like-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var result = await PostServices.LikePost(postId, email);
    res.send(result);
});
// TODO: unlike post
router.put('/unlike-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var result = await PostServices.UnlikePost(postId, email);
    res.send(result);
});
// TODO: comment post
router.put('/comment-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var content = req.body.content;
    var result = await PostServices.CommentPost(postId, email, content);
    createNotificationToPersonal(email, postId, 'comment');
    res.send(result);
});
// TODO: delete post comment
router.put('/delete-comment-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var date = req.body.date;
    var result = await PostServices.DeleteCommentPost(postId, email, date);
    res.send(result);
});
// TODO: like comment post
router.put('/like-comment-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var date = req.body.date;
    var emailCommentor = req.body.emailCommentor;
    var result = await PostServices.LikeCommentPost(postId, emailCommentor, date, email);
    res.send(result);
});
// TODO: unlike comment post
router.put('/unlike-comment-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var date = req.body.date;
    var emailCommentor = req.body.emailCommentor;
    var result = await PostServices.UnlikeCommentPost(postId, emailCommentor, date, email);
    res.send(result);
});


module.exports = router;
