const express = require('express');
const router = express.Router();
const logAuth = require('../middlewares/authentication.middleware');
const NotificationServices = require('../services/notification.services');

// get all notifications of user
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decode = logAuth.decodeToken(token);
        const email = decode.email;
        const notifications = await NotificationServices.getNotifications(email);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// set hasSeen = true
router.put('/', async (req, res) => {
    try {
        const id = req.body.id;
        const notifications = await NotificationServices.setHasSeen(id);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// delete notification
router.delete('/', async (req, res) => {
    try {
        const id = req.body.id;
        const notifications = await NotificationServices.deleteNotification(id);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;