const express = require('express')
const router = express.Router();
const sessionKeyAuth = require('../middlewares/authentication.middleware')
const ownership = require('../middlewares/validateOwner.middleware')
const teamService = require('../services/team.services')
const Logger = require('../utils/Logger');

router.all('', async (req, res) => {
    res.send("Welcome to the team router!")
})

router.get('/roles', async (req, res) => {
    const roles = ["admin", "writer"];
    res.status(200)
    res.send(roles)
})

/**
 * @description Fetch one team by email
 * @param {string} teamEmail
 * @returns {object} team
 * @throws {Error} error
 * @example GET /team/fetch/one/:teamEmail
 */
router.get('/fetch/one/:teamEmail', async (req, res) => {
    Logger.info("GET /team/fetch/one/:teamEmail")
    try {
        const teamEmail = req.params.teamEmail;
        const result = await teamService.getTeam(teamEmail);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Fetch multiple teams by email
 * @param {string[]} teamEmails
 * @returns {object[]} teams
 * @throws {Error} error
 * @example POST /team/fetch-many { teamEmails: string[] }
 */
router.post('/fetch/many', async (req, res) => {
    Logger.info("POST /team/fetch/many")
    try {
        const { teamEmails } = req.body;
        const result = await teamService.getMultipleTeams(teamEmails);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Fetch all teams owned or joined by an account (basic only)
 * @returns {object[]} teams
 * @throws {Error} error
 * 
 * @example GET /team/fetch/teams Headers: { authorization: <sessionkey> }
 */
router.get('/fetch/teams-by-account', sessionKeyAuth.CheckTimeoutToken, async (req, res) => {
    Logger.info("GET /team/fetch/teams")
    try {
        const email = sessionKeyAuth.getEmailFromToken(req, res);
        const result = await teamService.getTeamSpecificByAccount(email);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(402)
        res.send(error.message)
    }
})

router.get('/fetch/:teamEmail/populated', async (req, res) => {
    Logger.info("GET /team/fetch/:teamEmail/populated")
    try {
        const teamEmail = req.params.teamEmail;
        const result = await teamService.getTeamSpecific(teamEmail);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Fetch role of account in a team
 * @param {string} teamEmail
 * @returns {object} role
 * @throws {Error} error
 * 
 * @example GET /team/fetch/role/:teamEmail Headers: { authorization: <sessionkey> }
 */
router.get('/fetch/role/:teamEmail', sessionKeyAuth.CheckTimeoutToken, async (req, res) => {
    Logger.info("GET /team/fetch/role/:teamEmail")
    try {
        const email = sessionKeyAuth.getEmailFromToken(req, res);
        const teamEmail = req.params.teamEmail;

        const result = { "role": await teamService.getAccountRole(email, teamEmail) };

        res.status(200)
        res.send(result);
    } catch (error) {
        console.log(error)
        res.status(402)
        res.send(error.message)
    }
})

/**
 * @description Create a new team
 * @param {string} teamname
 * @param {string} description
 * @param {string} bground
 * @param {string} avatar
 * @returns {object} team
 * @throws {Error} error
 * @example POST /team/create Headers: { authorization: <sessionkey> } { teamname: string, description: string, bground: string, avatar: string }
 */
router.post('/create', sessionKeyAuth.CheckTimeoutToken, async (req, res) => {
    Logger.info("POST /team/create")
    try {
        const creatorEmail = sessionKeyAuth.getEmailFromToken(req, res);
        const { teamname, description, bground, avatar } = req.body;
        const result = await teamService.createTeam(teamname, description, bground, avatar, creatorEmail);

        res.status(201)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Update the teamname, description, bground, avatar of a team
 * @param {string} teamname
 * @param {string} description
 * @param {string} bground
 * @param {string} avatar
 * @returns {object} team
 * @throws {Error} error
 * @example PUT /team/update Headers: { authorization: <sessionkey> } { teamname: string, description: string, bground: string, avatar: string }
 */
router.put('/update/:teamEmail', sessionKeyAuth.CheckTimeoutToken, ownership.isAdminOfTeam, async (req, res) => {
    Logger.info("PUT /team/update/:teamEmail")
    try {
        const { teamname, description, bground, avatar } = req.body;
        const teamEmail = req.params.teamEmail;

        const result = await teamService.updateTeam(teamEmail, teamname, description, bground, avatar);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message);
    }
})

/**
 * @description Delete a team
 * @param {string} teamEmail
 * @returns {object} team
 * @throws {Error} error
 * @example DELETE /team/delete/:teamEmail Headers: { authorization: <sessionKey> }
 */
router.delete('/delete/:teamEmail', sessionKeyAuth.CheckTimeoutToken, ownership.isOwnerOfTeam, async (req, res) => {
    Logger.info("DELETE /team/delete/:teamEmail")
    try {
        const accountEmail = sessionKeyAuth.getEmailFromToken(req, res);
        const teamEmail = req.params.teamEmail;

        const result = await teamService.deleteTeam(teamEmail, accountEmail);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message);
    }
})

/**
 * @description Create a new member in a team with role. Must be an admin or owner.
 * @param {string} teamEmail - The email of the team to add the member to
 * @param {string} memberEmail - The email of the member to add to the team
 * @param {string} role - The role of the member to add to the team
 * 
 * @returns {object} - The updated team object
 * @throws {Error} error
 * 
 * @example POST /team/create/:teamEmail/:role { memberEmail: string }
 */
router.post('/:teamEmail/create/member', sessionKeyAuth.CheckTimeoutToken, ownership.isAdminOfTeam, async (req, res) => {
    Logger.info("POST /team/create/:teamEmail/:role")
    try {
        const { memberEmail, role } = req.body;
        const teamEmail = req.params.teamEmail;
        await teamService.addMember(teamEmail, memberEmail, role);
        const result = await teamService.getMemberSpecific(teamEmail, memberEmail);

        res.status(201)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Remove a member from a team. Must be an admin or owner.
 * @param {string} teamEmail - The email of the team to remove the member from
 * @param {string} memberEmail - The email of the member to remove from the team
 * 
 * @returns {object} - The updated team object
 * @throws {Error} error
 * 
 * @example DELETE /team/delete/:teamEmail/member { memberEmail: string }
 */
router.delete('/:teamEmail/delete/member', sessionKeyAuth.CheckTimeoutToken, ownership.isAdminOfTeam, async (req, res) => {
    Logger.info("DELETE /team/delete/:teamEmail/member")
    try {
        const callerEmail = sessionKeyAuth.getEmailFromToken(req, res);
        const teamEmail = req.params.teamEmail;
        const { memberEmail } = req.body;
        const result = await teamService.removeMember(teamEmail, memberEmail, callerEmail);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Update the role of a member in a team. Must be an admin or owner.
 * @param {string} teamEmail - The email of the team to update the member role in
 * @param {string} memberEmail - The email of the member to update the role of
 * @param {string} role - The new role of the member
 * 
 * @returns {object} - The updated team object
 * @throws {Error} error
 * 
 * @example PUT /team/update/:teamEmail/member Headers: {authorization: <sessionkey>} { memberEmail: string, role: string }
 */
router.put('/:teamEmail/update/member', sessionKeyAuth.CheckTimeoutToken, ownership.isAdminOfTeam, async (req, res) => {
    Logger.info("PUT /team/update/:teamEmail/member")
    try {
        const email = sessionKeyAuth.getEmailFromToken(req, res);
        const { memberEmail, role } = req.body;
        const teamEmail = req.params.teamEmail;

        const result = await teamService.updateMemberRole(teamEmail, memberEmail, role, email);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

/**
 * @description Create a new post in a team. Must be a member of the team.
 * @param {string} teamEmail - The email of the team to add the post to
 * @param {string} title - The title of the post
 * @param {string} content - The content of the post
 * @param {string} bground - The background of the post
 * 
 * @returns {object} - The updated team object
 * @throws {Error} error
 * 
 * @example POST /team/create/:teamEmail/post Headers: { authorization: <sessionkey> } { title: string, content: string, bground: string
 */
router.post('/:teamEmail/create/post', sessionKeyAuth.CheckTimeoutToken, ownership.isMemberOfTeam, async (req, res) => {
    Logger.info("POST /team/create/:teamEmail/post")
    try {
        const teamEmail = req.params.teamEmail;
        const { title, content, bground } = req.body;
        const result = await teamService.createTeamPost(title, content, bground, teamEmail);

        res.status(201)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

router.get('/:teamEmail/fetch/post', async (req, res) => {
    Logger.info("GET /team/fetch/:teamEmail/post")
    try {
        const teamEmail = req.params.teamEmail;
        const timestamp = req.query.date;
        const result = await teamService.getTeamPostsByTimestamp(teamEmail, timestamp);

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

router.get('/fetch/all', async (req, res) => {
    Logger.info("GET /team/fetch/all")
    try {
        const result = await teamService.getAllTeams();

        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
})

router.post('/get-list-info-team-by-emails', async (req, res) => {
    try {
        const result = await teamService.getListInfoTeamByEmails(req.body.listEmailTeam);
        res.status(200)
        res.send(result);
    } catch (error) {
        Logger.error(error)
        res.status(400)
        res.send(error.message)
    }
}) 

router.post('/:teamEmail/toggle-follow', sessionKeyAuth.CheckTimeoutToken, async (req, res) => {
    try {
        const teamEmail = req.params.teamEmail;
        const email = sessionKeyAuth.getEmailFromToken(req, res);
        const result = await teamService.followTeam(email, teamEmail);
        res.status(200).send(result);
    } catch(error) {
        Logger.error(error);
        res.status(400).send(error.message);
    }
})

router.delete('/:teamEmail/leave', sessionKeyAuth.CheckTimeoutToken, ownership.isMemberOfTeam, async (req, res) => {
    Logger.log("LEAVE TEAM");
    try {
        const teamEmail = req.params.teamEmail;
        const memberEmail = sessionKeyAuth.getEmailFromToken(req, res);
        const result = await teamService.leaveTeam(teamEmail, memberEmail);
        res.status(200).send(result);
    } catch(error) {
        Logger.error(error);
        res.status(400).send(error.message);
    }
})

router.delete('/:teamEmail/delete-team', sessionKeyAuth.CheckTimeoutToken, ownership.isOwnerOfTeam, async (req, res) => {
    Logger.log("DELETE TEAM");
    try {
        const teamEmail = req.params.teamEmail;
        const result = await teamService.deleteTeam(teamEmail);
        res.status(200).send(result);
    } catch(error) {
        Logger.error(error);
        res.status(400).send(error.message);
    }
})

router.delete('/:teamEmail/delete/post/:postId', sessionKeyAuth.CheckTimeoutToken, ownership.isMemberOfTeam, async (req, res) => {
    Logger.log("DELETE POST");
    try {
        const teamEmail = req.params.teamEmail;
        const postId = req.params.postId;
        const callerEmail = sessionKeyAuth.getEmailFromToken(req, res);
        const result = await teamService.deleteTeamPost(postId, teamEmail, callerEmail);
        res.status(200).send(result);
    } catch(error) {
        Logger.error(error);
        res.status(400).send(error.message);
    }
})

module.exports = router