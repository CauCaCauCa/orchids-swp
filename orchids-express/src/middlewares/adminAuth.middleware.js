const { getAccountsCollection } = require('../configs/MongoDB');
const sessionKeyAuth = require('../middlewares/authentication.middleware');
const { log } = require('../utils/Logger');

async function AdminOnly(req, res, next) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);
    const { collection, close } = await getAccountsCollection();

    const account = await collection.findOne({ email: email }, { projection: { role: 1 } });
    log(JSON.stringify(account))
    close();
    if (account.role === 'AD') {
        log(`Admin ${email} is accessing admin page`);
        next();
    } else {
        log(`Non-admin ${email} has been denied access to admin page`);
        res.status(403);
        res.send('You are not allowed to access this page');
    }
}

module.exports = { AdminOnly };