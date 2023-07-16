const { Post, Comment } = require('../modules/post.module');
const { connect } = require('../configs/MongoDB');
const { ObjectId } = require('mongodb');

// Get create post
async function CreatePost(post, emailCreator) {
    var postFormat = Post(post, emailCreator); // Format post
    const { collection, close } = await connect('orchids-1', 'post');
    var result = await collection.insertOne(postFormat);
    close();
    return result;
}
// Update post
async function UpdatePost(post, emailCreator) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = { _id: new ObjectId(post.postId) };
    const update = { $set: { ...post } };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}
// Delete post
async function DeletePost(postId, emailCreator) {
    const { collection, close } = await connect('orchids-1', 'post');
    var result = await collection.deleteOne({
        _id: new ObjectId(postId),
        emailCreator: emailCreator
    });
    close();
    return result;
}
// Get list post by time
async function GetListPostByTime(timestamp) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = timestamp ? { date: { $lt: parseInt(timestamp) } } : {};
    var result = await collection
        .find(query)
        .sort({ date: -1 })
        .limit(5)
        .toArray();
    close();
    return result;
}
// get list post by time and emailCreator
async function GetListPostByTimeAndEmailCreator(timestamp, emailCreator) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = timestamp
        ? { date: { $lt: parseInt(timestamp) }, emailCreator: emailCreator }
        : { emailCreator: emailCreator };
    var result = await collection
        .find(query)
        .sort({ date: -1 })
        .limit(5)
        .toArray();
    close();
    return result;
}
// get Post info for load Page Post.
async function GetPostInfoForLoadPage(postId) {
    try {
        const { collection, close } = await connect('orchids-1', 'post');
        var result = await collection.findOne({ _id: new ObjectId(postId) });
        close();
        return result;
    } catch (error) {
        console.log(error);
    }
}
// like post
async function LikePost(postId, email) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = { _id: new ObjectId(postId) };
    const update = { $addToSet: { ListEmailLiked: email } };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}
// unlike post
async function UnlikePost(postId, email) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = { _id: new ObjectId(postId) };
    const update = { $pull: { ListEmailLiked: email } };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}
// comment post
async function CommentPost(postId, email, comment) {
    const { collection, close } = await connect('orchids-1', 'post');
    var cmtFormat = Comment(comment, email);
    const query = { _id: new ObjectId(postId) };
    const update = { $addToSet: { ListComment: { ...cmtFormat } } };
    var result = await collection.updateOne(query, update);
    close();
    return {
        ...result,
        comment: cmtFormat
    };
}

// TODO: delete comment post
async function DeleteCommentPost(postId, email, date) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = { _id: new ObjectId(postId) };
    var id = date + email;
    const update = { $pull: { ListComment: { email: email, date: date } } };
    var result = await collection.updateOne(query, update, true);
    close();
    return result;
}

// TODO: like comment post
async function LikeCommentPost(postId, email, date, EmailLiker) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = {
        _id: new ObjectId(postId),
        'ListComment.email': email,
        'ListComment.date': date
    };
    const update = {
        $addToSet: { 'ListComment.$.ListEmailLiked': EmailLiker }
    };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}

// TODO: unlike comment post
async function UnlikeCommentPost(postId, email, date, EmailLiker) {
    const { collection, close } = await connect('orchids-1', 'post');
    const query = {
        _id: new ObjectId(postId),
        'ListComment.email': email,
        'ListComment.date': date
    };
    const update = { $pull: { 'ListComment.$.ListEmailLiked': EmailLiker } };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}

module.exports = {
    CreatePost,
    UpdatePost,
    DeletePost,
    GetListPostByTime,
    GetListPostByTimeAndEmailCreator,
    GetPostInfoForLoadPage,
    LikePost,
    UnlikePost,
    CommentPost,
    DeleteCommentPost,
    LikeCommentPost,
    UnlikeCommentPost
};

async function main() {
    // !test create post function
    // console.log(await CreatePost({ title: 'testTitle', content: 'testContent' }, "tienntse161099@fpt.edu.vn"));
    // !test update post function
    // console.log(await UpdatePost('64954933f3f022442baf3cd7', { title: 'testTitleUpdate2', content: 'testContentUpdate2', bground: 'bgtestUPdate2' }, 'tienntse161099@fpt.edu.vn'));
    // !test delete post function
    // console.log(await DeletePost('64954933f3f022442baf3cd7', 'tienntse161099@fpt.edu.vn'));
    // !test get list post by time function
    // console.log(await GetListPostByTime());
    // !test get list post by time and emailCreator function
    // console.log(await GetListPostByTimeAndEmailCreator(1687594185161, 'tienntse161099@fpt.edu.vn'));
    // !test get post info for load page function
    // console.log(await GetPostInfoForLoadPage('64abae194878c4fa0fdc5ccb'));
    // !test like post function
    // console.log(await LikePost('64954933f3f022442baf3cd7', 'liketer@gmail.com'));
    // !test unlike post function
    // console.log(await UnlikePost('64954933f3f022442baf3cd7', 'liketer@gmail.com'));
    // !test comment post function
    // console.log(await CommentPost('64954933f3f022442baf3cd7', 'commentor@gmail.com', 'test comment'));
    // !test delete comment post function
    // console.log(await DeleteCommentPost('64954933f3f022442baf3cd7', 'commentor@gmail.com', 1687505498285));
    // !test like comment post function
    // console.log(await LikeCommentPost('64a2eec8ab6df27699813e93', 'tienntse161099@fpt.edu.vn', 1688402718770, 'tientdx@gmail.com'));
    // !test unlike comment post function
    // console.log(await UnlikeCommentPost('64a2eec8ab6df27699813e93', 'tienntse161099@fpt.edu.vn', 1688402718770, 'tientdx@gmail.com'));
}

main();
