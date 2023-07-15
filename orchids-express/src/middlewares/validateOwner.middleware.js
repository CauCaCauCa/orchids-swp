const { getQuestionsCollection } = require('../configs/MongoDB')
const { ObjectId } = require('mongodb');
const sessionKeyAuth = require('../middlewares/authentication.middleware');
const { isRole, isOwner, isMember } = require('../services/team.services');
const Logger = require('../utils/Logger');

async function template(req, res, next, collection, name) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);
    const requestObjectId = req.body._id;
    const question = await collection.findOne({ _id: new ObjectId(requestObjectId) }, { projection: { creator: 1 } })

    if (!question) {
        res.status(404);
        res.send(`Cannot find ${name}`)
    } else if (question.creator === email) {
        next();
    } else {
        res.status(403);
        res.send(`User is not allowed to modify ${name}`)
    }
}

async function isOwnerOfQuestion(req, res, next) {
    return template(req, res, next, await getQuestionsCollection(), 'question');
}

async function isOwnerOfAnswer(req, res, next) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);
    const body = req.body;
    const parentId = body.parent;
    const answerId = body._id;

    const collection = await getQuestionsCollection();

    const question = await collection.findOne({ _id: new ObjectId(parentId) }, { projection: { answers: 1 } })
    const answer = question.answers.find(answer => answer._id === answerId);
    if (answer && answer.creator === email) {
        next();
    } else {
        res.status(403);
        res.send(`User is not allowed to modify answer`)
    }
}

async function isAdminOfTeam(req, res, next) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);

    const teamEmail = req.params.teamEmail || req.body.teamEmail || (() => { throw new Error('No team email provided') })();

    Logger.info(`Checking if ${email} is admin of team ${teamEmail}...`);

    // check if user is admin of team or owner
    try {
        if(await isOwner(teamEmail, email) || await isRole('admin', teamEmail, email)) {
            next();
            return;
        }
    } catch(error) {
        Logger.error(error)
        res.status(404);
        res.send(error.message)
        return;
    }

    res.status(403);
    res.send(`User is not allowed to modify team`)
}

async function isMemberOfTeam(req, res, next) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);
    const teamEmail = req.params.teamEmail || req.body.teamEmail || (() => { throw new Error('No team email provided') })();

    Logger.info(`Checking if ${email} is writer of team ${teamEmail}...`);

    // check if user is admin or owner or writer
    try {
        if(await isOwner(teamEmail, email) || await isMember(teamEmail, email)) {
            next();
            return;
        }
    } catch(error) {
        Logger.error(error);
        res.status(404);
        res.send(error.message)
        return;
    }

    res.status(403);
    res.send(`User is not allowed to modify team`)
}

async function isOwnerOfTeam(req, res, next) {
    const email = sessionKeyAuth.getEmailFromToken(req, res);
    const teamEmail = req.params.teamEmail || req.body.teamEmail || (() => { throw new Error('No team email provided') })();

    Logger.info(`Checking if ${email} is owner of team ${teamEmail}...`);

    // check if user is owner of team
    try {
        if (await isOwner(teamEmail, email)) {
            next();
            return;
        }
    } catch(error) {
        Logger.error(error);
        res.status(404);
        res.send(error.message)
        return;
    }

    res.status(403);
    res.send(`User is not allowed to modify team`)
}

module.exports = {
    isOwnerOfQuestion,
    isOwnerOfAnswer,
    isAdminOfTeam,
    isOwnerOfTeam,
    isMemberOfTeam
}