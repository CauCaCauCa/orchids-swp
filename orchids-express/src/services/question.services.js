const { Question } = require('../modules/question.module');
const { connect } = require('../configs/MongoDB');
const { Answer } = require('../modules/question.module');
const { ObjectId } = require('mongodb');

// create question
async function CreateQuestion(image, content, email) {
    var questionFormat = Question(image, content, email); // Format post
    const {collection, close} = await connect('orchids-1', 'question');
    var result = await collection.insertOne(questionFormat);
    close();
    return result;
}

// get question by id
async function GetQuestionByID(id) {
    const {collection, close} = await connect('orchids-1', 'question');
    const query = { _id: new ObjectId(id) };
    var result  = await collection.findOne(query);
    close();
    return result;
}

// delete question
async function DeleteQuestion(id, email) {
    const {collection, close} = await connect('orchids-1', 'question');
    var result = await collection.deleteOne({ _id: new ObjectId(id), creatorEmail: email });
    close();
    return result;
}

// get list question by time
async function GetListQuestionByTime(targetDate) {
    const {collection, close} = await connect('orchids-1', 'question');
    if (targetDate) {
        const query = { createDate: { $lt: parseInt(targetDate) } };
        var result = await collection.find(query).sort({ createDate: -1 }).limit(5).toArray();
        close();
        return result;
    } else {
        var result = await collection.find({}).sort({ createDate: -1 }).limit(5).toArray();
        close();
        return result;
    }
}

// get question by id
async function GetQuestionByID(id) {
    const {collection, close} = await connect('orchids-1', 'question');
    const query = { _id: new ObjectId(id) };
    var result = await collection.findOne(query);
    close();
    return result;
}

// answer question
async function AnswerQuestion(questionID, content, createDate, email) {
    const {collection, close} = await connect('orchids-1', 'question');
    const query = { _id: new ObjectId(questionID) };
    var answerFormat = Answer({ content, createDate }, email);
    var result = await collection.updateOne(query, { $push: { answers: answerFormat } });
    close();
    return result;
}

// delete answer
async function DeleteAnswer(questionID, createDate, email) {
    const {collection, close} = await connect('orchids-1', 'question');
    const query = { _id: new ObjectId(questionID) };
    var result = await collection.updateOne(query, { $pull: { answers: { createDate: createDate, emailCreator: email } } });
    close();
    return result;
}

// like answer
async function LikeAnswer(questionID, answerCreateDate, emailCreator, emailLiker) {
    try {
        const {collection, close} = await connect('orchids-1', 'question');
        const filter = {
            "_id": new ObjectId(questionID),
            "answers.createDate": answerCreateDate,
            "answers.emailCreator": emailCreator
        };
        const update = {
            $addToSet: {
                "answers.$.likes": emailLiker
            }
        };
        var result = await collection.updateOne(filter, update);
        close();
        return result;
    } catch (error) {
        console.log("An error occurred:", error);
    }
}
// unlike answer
async function UnlikeAnswer(questionID, answerCreateDate, emailCreator, emailLiker) {
    try {
        const {collection, close} = await connect('orchids-1', 'question');
        const filter = {
            "_id": new ObjectId(questionID),
            "answers.createDate": answerCreateDate,
            "answers.emailCreator": emailCreator
        };
        const update = {
            $pull: {
                "answers.$.likes": emailLiker
            }
        };
        var result = await collection.updateOne(filter, update);
        close();
        return result;
    } catch (error) {
        console.log("An error occurred:", error);
    }
}







module.exports = {
    CreateQuestion,
    DeleteQuestion,
    GetQuestionByID,
    GetListQuestionByTime,
    GetQuestionByID,
    AnswerQuestion,
    DeleteAnswer,
    LikeAnswer,
    UnlikeAnswer,
}

async function test() {
    // !test create question
    // console.log(await CreateQuestion('image', 'content', 'tienntse161099@fpt.edu.vn'));

    // !test delete question
    // console.log(await DeleteQuestion('6495ae37565d5c5dd7dce343', 'tienntse161099@fpt.edu.vn'));

    // !test get question by id
    // console.log(await GetQuestionByID('64b10dd71ed54a8bd5beeecb'));

    // !test get list question by time
    // console.log(await GetListQuestionByTime(1687599002743));

    // !test answer question
    // console.log(await AnswerQuestion('6495ae37565d5c5dd7dce343', 'oke', 'tienntse161099@fpt.edu.vn'));

    // !test delete answer
    // console.log(await DeleteAnswer('6496da3454d3294a19e339d4', 1687678919896, 'tienntse161099@fpt.edu.vn'));

    // !test like answer
    // console.log(await LikeAnswer("6495ae37565d5c5dd7dce343", 1687625467962, "tienntse161099@fpt.edu.vn", "newemail@example.com"));

    // !test unlike answer
    // console.log(await UnlikeAnswer("6495ae37565d5c5dd7dce343", 1687625467962, "tienntse161099@fpt.edu.vn", "newemail@example.com"));
}
test();