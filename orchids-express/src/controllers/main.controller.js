const express = require('express');
const cors = require('cors');

const app = express();
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(
    cors({
        origin: 'http://localhost:3000', // Chỉ cho phép yêu cầu từ nguồn gốc này
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức GET và POST
        allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ cho phép các header cụ thể
    })
);


const loginRouter = require('../routes/login.router');
const accountRouter = require('../routes/account.router');
const donationRouter = require('../routes/donation.router');
const postRouter = require('../routes/post.router');
const questionRouter = require('../routes/question.router');
const teamRouter = require('../routes/team.router');
const notificationRouter = require('../routes/notification.router');
const adminRouter = require('../routes/admin.router');
// Import other routers as needed

// Define the main route
app.get('/', (req, res) => {
    res.send('Welcome to the orchids api!');
});

// Mount the routers
app.use('/login', loginRouter);
app.use('/account', accountRouter);
app.use('/donation', donationRouter);
app.use('/post', postRouter);
app.use('/question', questionRouter);
app.use('/team', teamRouter);
app.use('/notification', notificationRouter);
app.use('/admin', adminRouter);

// Use other routers as needed

module.exports = app;
