const express = require('express');
const router = express.Router();
const logAuth = require('../middlewares/authentication.middleware');
const AccountServices = require('../services/account.services');

// /account/

router.get('/', async (req, res) => {
  res.send('Welcome to account api!');
});

// TODO: get user info for load page by username - check again done
router.get('/get-account-info-by-username', async (req, res) => {
  try {
    const username = req.query.username;
    const result = await AccountServices.getAccountInfoByUsername(username);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});
// TODO: get list username by list emails - check again done
router.post('/get-list-username-by-emails', async (req, res) => {
  var listEmail = req.body.emails;
  var result = await AccountServices.getListUsernameByEmail(listEmail);
  res.send(result);
});

// ! required token
// TODO: get account info with token - check again done
router.get('/get-account-info', logAuth.CheckTimeoutToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const data = logAuth.decodeToken(token);
    try {
      const result = await AccountServices.getAccountInfoByEmail(data.email);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});
// TODO: update username
router.put('/update-username', logAuth.CheckTimeoutToken, async (req, res) => {
  try {
    const username = req.body.username;
    const token = req.headers['authorization'];
    const data = logAuth.decodeToken(token);
    try {
      const result = await AccountServices.updateUsername(data.email, username);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});
// TODO: update background image
router.put('/update-bground', logAuth.CheckTimeoutToken, async (req, res) => {
  try {
    const bground = req.body.bground;
    const token = req.headers['authorization'];
    const data = logAuth.decodeToken(token);
    try {
      const result = await AccountServices.updateBgroundImage(data.email, bground);
      res.send({ msg: result });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// TODO: follow user
router.put('/follow-user', logAuth.CheckTimeoutToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const data = logAuth.decodeToken(token);
    const EmailDes = req.body.emailDes;
    const result = await AccountServices.addEmailToFollowingList(data.email, EmailDes);
    AccountServices.addEmailToFollowerList(EmailDes, data.email);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// TODO: unfollow user
router.put('/unfollow-user', logAuth.CheckTimeoutToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const data = logAuth.decodeToken(token);
    const EmailDes = req.body.emailDes;
    const result = await AccountServices.removeEmailFromFollowingList(data.email, EmailDes);
    AccountServices.removeEmailFromFollowerList(EmailDes, data.email);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;