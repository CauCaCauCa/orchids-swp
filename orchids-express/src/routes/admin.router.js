const express = require('express');
const router = express.Router();
const logAuth = require('../middlewares/authentication.middleware');
const AdminService = require('../services/admin.services');
const AccountService = require('../services/account.services');
const PostService = require('../services/post.services');
const QuestionService = require('../services/question.services');
const Logger = require('../utils/Logger');
const RoleAuth = require('../middlewares/adminAuth.middleware');

router.all('', (req, res) => {
    res.send("Welcome to admin page");
})

// TODO Find how this works...
router.post('/notification/:receiver', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Create notification');
    try {
        const { receiver } = req.params;
        const { title, content } = req.body;
        const result = await AdminService.createNotification(receiver, title, content);
        res.status(200).json(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

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

// #region FETCHERS 

router.post('/accounts/page-fetch', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Get all accounts');
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;
        const filter = req.body.filter || {};
        const projection = req.body.projection || {};

        const result = await AdminService.GetAccountsByPage(page, limit, filter, projection);

        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }

})

router.post('/posts/page-fetch', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get all posts")
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;
        const filter = req.body.filter || {};
        const projection = req.body.projection || {};

        const result = await AdminService.GetPostsByPage(page, limit, filter, projection);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

router.post('/teams/page-fetch', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get all teams")
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;
        const filter = req.body.filter || {};
        const projection = req.body.projection || {};

        const result = await AdminService.GetTeamsByPage(page, limit, filter, projection);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

router.post('/questions/page-fetch', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get all questions")
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;
        const filter = req.body.filter || {};
        const projection = req.body.projection || {};

        const result = await AdminService.GetQuestionsByPage(page, limit, filter, projection);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

// #endregion

// * Fetch statistics of all accounts
router.get('/accounts/stats', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get accounts stats")
    try {
        const result = await AdminService.GetAccountsStats();
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

// * Deactivate an account
router.post('/account/:accountEmail/deactivate', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Deactivate account');
    try {
        const accountEmail = req.params.accountEmail;
        const result = await AdminService.ToggleDeactivateAccount(accountEmail);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

// * Toggle account admin role
router.post('/account/:accountEmail/admin', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Toggle admin account');
    try {
        const accountEmail = req.params.accountEmail;
        const value = req.query.value;
        const result = await AdminService.toggleAccountAdmin(accountEmail, value);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

// * Fetch one account by email
router.get('/accounts/:accountEmail', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Get account by email');
    try {
        const accountEmail = req.params.accountEmail;
        const result = await AccountService.getAccountInfoByEmail(accountEmail);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

// * Fetch statistics of all posts
router.get('/post/stats', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get post stats")
    try {
        const result = await AdminService.GetPostStats();
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

router.get('/post/:id', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log('Get post by id');
    try {
        const postId = req.params.id;
        const result = await PostService.GetPostInfoForLoadPage(postId);
        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' })
    }
})

router.get('/question/:id', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get question by id");
    try {
        const questionId = req.params.id
        const result = await QuestionService.GetQuestionByID(questionId);

        res.status(200);
        res.send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
})

router.get('/questions/stats', logAuth.CheckTimeoutToken, RoleAuth.AdminOnly, async (req, res) => {
    Logger.log("Get questions stats")
    try {
        const result = await AdminService.GetQuestionsStats();
        res.status(200).send(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error })
    }
})

module.exports = router;