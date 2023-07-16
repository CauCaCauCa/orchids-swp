const { getAccountsCollection, getPostsCollection, getTeamsCollection, getQuestionsCollection } = require('../configs/MongoDB');

// #region MAIN PAGE FETCHERS

async function GetAccountsByPage(page, limit, filter, projection) {
    const { collection, close } = await getAccountsCollection();
    const accounts = await collection.find(filter, { projection: projection }).limit(Number(limit)).skip(page * limit).toArray();
    const total = await collection.countDocuments(filter);
    close();
    return {
        "total": total,
        "currentPage": Number(page),
        "currentObject": "account",
        "list": accounts
    };
}

async function GetPostsByPage(page, limit, filter, projection) {
    const { collection, close } = await getPostsCollection();
    const posts = await collection.find(filter, { projection: projection }).limit(Number(limit)).skip(page * limit).toArray();
    const total = await collection.countDocuments(filter);
    close();
    return {
        "total": total,
        "currentPage": Number(page),
        "currentObject": "post",
        "list": posts
    }
}

async function GetTeamsByPage(page, limit, filter, projection) {
    const { collection, close } = await getTeamsCollection();
    const teams = await collection.find(filter, { projection: projection }).limit(Number(limit)).skip(page * limit).toArray();
    const total = await collection.countDocuments(filter);
    close();
    return {
        "total": total,
        "currentPage": Number(page),
        "currentObject": "team",
        "list": teams
    }
}

async function GetQuestionsByPage(page, limit, filter, projection) {
    const { collection, close } = await getQuestionsCollection();
    const questions = await collection.find(filter, { projection: projection }).limit(Number(limit)).skip(page * limit).toArray();
    const total = await collection.countDocuments(filter);
    close();
    return {
        "total": total,
        "currentPage": Number(page),
        "currentObject": "question",
        "list": questions
    }
}

// #endregion

async function GetAccountsStats() {
    const { collection, close } = await getAccountsCollection();
    const users = await collection.countDocuments({ role: "US" });
    const admins = await collection.countDocuments({ role: "AD" });
    const active = await collection.countDocuments({ status: true });
    const inactive = await collection.countDocuments({ status: false });
    const latestAccountCreation = await collection.find({}, { projection: { _id: 0, username: 1, email: 1, created_at: 1 } }).sort({ created_at: -1 }).limit(1).toArray();
    const accountsCreatedInLast7Days = await collection.countDocuments({ created_at: { $gte: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60 } });
    const accountWithMostPosts = await collection.find({}).sort({ numberPost: -1 }).limit(-1).toArray();
    const accountWithMostQuestions = await collection.find({}).sort({ numberQuestion: -1 }).limit(-1).toArray();
    const mostFollowedAccount = await collection.aggregate([
        {
            $project: {
                _id: 0,
                username: 1,
                email: 1,
                ListEmailFollowerCount: { $size: "$ListEmailFollower" }
            }
        },
        {
            $sort: {
                ListEmailFollowerCount: -1
            }
        },
        {
            $limit: 1
        }
    ]).toArray()

    const latestAccount = latestAccountCreation[0];
    close();
    return {
        "users": users,
        "admins": admins,
        "active": active,
        "inactive": inactive,
        "accountsCreatedInLast7Days": accountsCreatedInLast7Days,
        "latestAccountCreation": latestAccount,
        "accountWithMostPosts": !accountWithMostPosts ? null : {
            "username": accountWithMostPosts[0].username,
            "email": accountWithMostPosts[0].email,
            "numberPost": accountWithMostPosts[0].numberPost
        },
        "accountWithMostQuestions": !accountWithMostQuestions ? null : {
            "username": accountWithMostQuestions[0].username,
            "email": accountWithMostQuestions[0].email,
            "numberQuestion": accountWithMostQuestions[0].numberQuestion
        },
        "mostFollowedAccount": mostFollowedAccount[0]
    }
}

async function toggleAccountAdmin(email, value) {
    const { collection, close } = await getAccountsCollection();
    collection.updateOne({ email: email }, { $set: { role: (value) } });
    close();
    return {
        "accountEmail": email,
        "admin": value
    }
}

async function ToggleDeactivateAccount(accountEmail) {
    const { collection, close } = await getAccountsCollection();
    const account = await collection.findOne({ email: accountEmail }) || (() => { throw new Error('Account not found') })();

    collection.updateOne({ email: accountEmail }, { $set: { status: !account.status } })

    close();
    return {
        "message": "Toggle deactivate account successfully",
        "accountEmail": accountEmail,
        "status": account.status
    }
}

async function GetPostStats() {
    const { collection, close } = await getPostsCollection();

    const total = await collection.countDocuments({});
    const teamPosts = await collection.countDocuments({ isTeam: true })
    const latestPost = await collection.find({}).sort({ date: -1 }).limit(1).toArray();
    const postCreatedInLast7Days = await collection.countDocuments({ date: { $gte: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60 } });
    const mostLikedPost = await collection.aggregate([
        {
            $project: {
                _id: 1,
                title: 1,
                NumberLikes: { $size: "$ListEmailLiked" }
            }
        },
        {
            $sort: {
                NumberLikes: -1
            }
        },
        {
            $limit: 1
        }
    ]).toArray()
    const mostCommentedPost = await collection.aggregate([
        {
            $project: {
                _id: 1,
                title: 1,
                NumberComments: { $size: "$ListComment" }
            }
        },
        {
            $sort: {
                NumberComments: -1
            }
        },
        {
            $limit: 1
        }
    ]).toArray();

    close();
    return {
        "total": total,
        "teamPosts": teamPosts,
        "latestPost": !latestPost ? null : {
            "_id": latestPost[0]._id,
            "title": latestPost[0].title,
            "date": latestPost[0].date
        },
        "postCreatedInLast7Days": postCreatedInLast7Days,
        "mostLikedPost": mostLikedPost[0],
        "mostCommentedPost": mostCommentedPost[0]
    }
}

async function GetQuestionsStats() {
    const { collection, close } = await getQuestionsCollection();

    const totalQuestions = await collection.countDocuments({})
    const totalAnswers = await collection.aggregate([
        {
            $project: {
                answerCount: { $size: "$answers" }
            }
        },
        {
            $group: {
                _id: null,
                totalAnswers: { $sum: "$answerCount" }
            }
        }
    ]).toArray();
    const questionsCreatedInLast7Days = await collection.countDocuments({ createDate: { $gte: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60 } });
    const latestQuestion = await collection.find({}).sort({ createDate: -1 }).limit(1).toArray();

    return {
        total: totalQuestions,
        totalAnswers: totalAnswers[0].totalAnswers,
        questionsCreatedInLast7Days,
        latestQuestion: latestQuestion[0]
    }
}

module.exports = {
    GetAccountsByPage,
    GetPostsByPage,
    GetTeamsByPage,
    GetQuestionsByPage,
    GetAccountsStats,
    toggleAccountAdmin,
    ToggleDeactivateAccount,
    GetPostStats,
    GetQuestionsStats
}