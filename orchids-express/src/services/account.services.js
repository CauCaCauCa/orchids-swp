const AccountFormat = require('../modules/account.module');
const { connect, getAccountsCollection } = require('../configs/MongoDB');


// Check if an account exists in the database
async function isExistAccount(payload) {
    const { collection, close } = await connect('orchids-1', 'account');
    var isExist = await collection.findOne({ 'email': payload.email });
    close();
    if (isExist) {
        return true;
    }
    console.log("Account is not exist");
    return false;
}
// check status account true or false
async function checkStatusAccount(email) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.find({ 'email': email }).project({ _id: 0, status: 1 }).toArray();
    close();
    return result[0].status;
}
// set status account
async function setStatusAccount(email, status) {
    const { collection, close } = await connect('orchids-1', 'account');
    const query = { email: email };
    const update = { $set: { status: status } };
    var result = await collection.updateOne(query, update);
    close();
    return result;
}
// Create a new account
async function createAccount(payload) {
    const { collection, close } = await connect('orchids-1', 'account');
    var user = AccountFormat(payload);
    const result = await collection.insertOne(user);
    console.log('Inserted account ID:', result.insertedId);
    close();
    return result;
}
// Get account information by email
async function getAccountInfoByEmail(email, projection) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = collection.findOne({ 'email': email }, projection);
    close();
    return result;
}
// get list username by list emails
async function getListUsernameByEmail(listEmail) {
    const { collection, close } = await connect('orchids-1', 'account');
    const query = { email: { $in: listEmail } };
    const projection = { username: 1, avatar: 1, email: 1 };
    var result = await collection.find(query).project(projection).toArray();
    close();
    return result;
}
// Get account information by username
async function getAccountInfoByUsername(username) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.findOne({ 'username': username });
    close();
    return result;
}

// ! update functions
async function updateUsername(email, username) {
    const { collection, close } = await connect('orchids-1', 'account');

    // Kiểm tra xem username đã tồn tại hay chưa
    const existingUser = await collection.findOne({ 'username': username });
    if (existingUser) {
        return { msg: 'Tên người dùng đã tồn tại. Vui lòng chọn tên khác.' };
    }
    // Cập nhật tên người dùng
    var result = await collection.updateOne(
        { 'email': email },
        {
            $set: {
                'username': username
            }
        }
    );

    await close();
    return result;
}

// Update brandground image
async function updateBgroundImage(email, bground) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $set: {
                'bground': bground
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// update numberPost + 1
async function updateNumberPost(email) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $inc: {
                'numberPost': 1
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// update numberPost - 1
async function updateNumberPostDes(email) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $inc: {
                'numberPost': -1
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// update number question + 1
async function updateNumberQuestionInc(email) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $inc: {
                'numberQuestion': 1
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// update number question - 1
async function updateNumberQuestionDes(email) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $inc: {
                'numberQuestion': -1
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}

// add email to list email followers
async function addEmailToFollowerList(email, emailFollower) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $addToSet: {
                'ListEmailFollower': emailFollower
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// remove email from list email followers
async function removeEmailFromFollowerList(email, emailFollower) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $pull: {
                'ListEmailFollower': emailFollower
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}

// add email to list email following
async function addEmailToFollowingList(email, emailFollowing) {
    const { collection, close } = await connect('orchids-1', 'account');
    console.log(email);
    console.log(emailFollowing);
    var result = await collection.updateOne(
        { 'email': email },
        {
            $addToSet: {
                'ListEmailFollowing': emailFollowing
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// remove email from list email following
async function removeEmailFromFollowingList(email, emailFollowing) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result =  collection.updateOne(
        { 'email': email },
        {
            $pull: {
                'ListEmailFollowing': emailFollowing
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}

// add email to list team owner
async function addEmailToTeamOwnerList(email, emailTeam) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $addToSet: {
                'ListEmailTeamOwner': emailTeam
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// remove email from list team owner
async function removeEmailFromTeamOwnerList(email, emailTeamOwner) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $pull: {
                'ListEmailTeamOwner': emailTeamOwner
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}

// add email  to list team attend
async function addEmailToTeamAttendList(email, emailTeamAttend) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $addToSet: {
                'ListEmailTeamAttend': emailTeamAttend
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}
// remove email from list team attend
async function removeEmailFromTeamAttendList(email, emailTeamAttend) {
    const { collection, close } = await connect('orchids-1', 'account');
    var result = await collection.updateOne(
        { 'email': email },
        {
            $pull: {
                'ListEmailTeamAttend': emailTeamAttend
            }
        }
    );
    await close();
    return result;
    // console.log(`Updated ${result.modifiedCount} document(s)`);
}



module.exports = {
    isExistAccount,
    checkStatusAccount,
    setStatusAccount,
    createAccount,
    getAccountInfoByEmail,
    getListUsernameByEmail,
    getAccountInfoByUsername,
    updateUsername,
    updateBgroundImage,
    updateNumberPost,
    updateNumberPostDes,
    updateNumberQuestionInc,
    updateNumberQuestionDes,
    addEmailToFollowerList,
    removeEmailFromFollowerList,
    addEmailToFollowingList,
    removeEmailFromFollowingList,
    addEmailToTeamOwnerList,
    removeEmailFromTeamOwnerList,
    addEmailToTeamAttendList,
    removeEmailFromTeamAttendList,
}


// async function test() {
//     // !test add email to list email follower
//     var result = await addEmailToFollowingList('tienntse161099@fpt.edu.vn', 'test2@gmail');
//     addEmailToFollowerList('test2@gmail', 'tienntse161099@fpt.edu.vn');
//     console.log(result);
// }


// test();