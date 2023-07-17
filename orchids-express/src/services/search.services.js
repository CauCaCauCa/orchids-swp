const {
    getAccountsCollection,
    getPostsCollection,
    getTeamsCollection,
    getQuestionsCollection
} = require('../configs/MongoDB');

class SearchResult {
    constructor(id, type, image, title, date, emailCreator) {
        this.id = id;
        this.type = type;
        this.image = image;
        this.title = title;
        this.date = date;
        this.emailCreator = emailCreator;
    }
}

const DEFAULT_SEARCH_LIMIT = 20;

async function searchByKeywordPreview(keyword) {
    const limit = 3;

    const accounts = await searchAccounts(keyword, limit);
    const posts = await searchPosts(keyword, limit);
    const teams = await searchTeams(keyword, limit);
    const questions = await searchQuestions(keyword, limit);
    return {
        found: accounts.length + posts.length + teams.length + questions.length,
        accounts,
        posts,
        teams,
        questions
    };
}

async function searchByKeywordFull(keyword) {
    const accounts = await searchAccounts(keyword);
    const posts = await searchPosts(keyword);
    const teams = await searchTeams(keyword);
    const questions = await searchQuestions(keyword);
    return {
        found: accounts.length + posts.length + teams.length + questions.length,
        accounts,
        posts,
        teams,
        questions
    };
}

async function searchAccounts(keyword, limit = DEFAULT_SEARCH_LIMIT) {
    const { collection, close } = await getAccountsCollection();
    const accounts = await collection
        .find(
            {
                $or: [
                    { username: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } }
                ]
            },
            {
                projection: {
                    email: 1,
                    username: 1,
                    avatar: 1
                }
            }
        )
        .limit(limit)
        .toArray();
    close();
    return accounts.map(
        (account) =>
            new SearchResult(
                account.username,
                'account',
                account.avatar,
                account.username,
                undefined,
                undefined
            )
    );
}

async function searchPosts(keyword, limit = DEFAULT_SEARCH_LIMIT) {
    const { collection, close } = await getPostsCollection();
    const posts = await collection
        .find(
            {
                title: { $regex: keyword, $options: 'i' }
            },
            {
                projection: {
                    _id: 1,
                    emailCreator: 1,
                    title: 1,
                    date: 1
                }
            }
        )
        .limit(limit)
        .toArray();
    close();
    return posts.map(
        (post) =>
            new SearchResult(
                post._id,
                'post',
                undefined,
                post.title,
                post.date,
                post.emailCreator
            )
    );
}

async function searchTeams(keyword, limit = DEFAULT_SEARCH_LIMIT) {
    const { collection, close } = await getTeamsCollection();
    const teams = await collection
        .find(
            {
                teamname: { $regex: keyword, $options: 'i' }
            },
            {
                projection: {
                    _id: 1,
                    teamname: 1,
                    avatar: 1,
                    email: 1
                }
            }
        )
        .limit(limit)
        .toArray();
    close();
    return teams.map(
        (team) =>
            new SearchResult(
                team.email,
                'team',
                team.avatar,
                team.teamname,
                undefined,
                undefined
            )
    );
}

async function searchQuestions(keyword, limit = DEFAULT_SEARCH_LIMIT) {
    const { collection, close } = await getQuestionsCollection();
    const questions = await collection
        .find(
            {
                content: { $regex: keyword, $options: 'i' }
            },
            {
                projection: {
                    _id: 1,
                    content: 1,
                    creatorEmail: 1
                }
            }
        )
        .limit(limit)
        .toArray();
    close();
    return questions.map(
        (question) =>
            new SearchResult(
                question._id,
                'question',
                undefined,
                question.content,
                undefined,
                question.creatorEmail
            )
    );
}

module.exports = {
    searchByKeywordPreview,
    searchByKeywordFull
};
