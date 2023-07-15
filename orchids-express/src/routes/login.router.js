const express = require('express');
const router = express.Router();
const logAuth = require('../middlewares/authentication.middleware');
const AccountServices = require('../services/account.services');

router.post('/', async (req, res) => {
  try {
    const token = req.body.token;
    const account = {};

    const result = await logAuth.verifyToken(token);
    account.email = result.email;
    account.avatar = result.picture;

    if (result.msg === 'Invalid token') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      const isExist = await AccountServices.isExistAccount(account);
      if (!isExist) {
        console.log('Creating a new account');
        await AccountServices.createAccount(account);
        const res_token = logAuth.generateToken(account);
        res.status(200).json({ token: res_token });
      } else if ( await AccountServices.checkStatusAccount(result.email) === 'true') {
        const res_token = logAuth.generateToken(account);
        res.status(200).json({ token: res_token });
      } else {
        res.status(403).json({ msg: 'A account is blocked !' });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
