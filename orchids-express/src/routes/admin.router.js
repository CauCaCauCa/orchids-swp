const express = require('express');
const router = express.Router();
const logAuth = require('../middlewares/authentication.middleware');

// create function isAdmin

// get list report post from user
router.get('/get-list-report-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var result = await PostServices.GetListReportPost(email);
    res.send(result);
});

// accept report post
router.put('/accept-report-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var result = await PostServices.AcceptReportPost(postId, email);
    res.send(result);
});

// deny report post
router.put('/deny-report-post', logAuth.CheckTimeoutToken, async (req, res) => {
    const token = req.headers['authorization'];
    const email = logAuth.decodeToken(token).email;
    var postId = req.body.postId;
    var result = await PostServices.DenyReportPost(postId, email);
    res.send(result);
});

