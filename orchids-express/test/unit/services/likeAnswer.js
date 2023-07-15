const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

async function LikeAnswer(questionID, answerCreateDate, emailCreator, emailLiker) {
  try {
    const uri = 'mongodb+srv://dotien_admin:loginto123@orchids-db.09jmkh4.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db('orchids-1'); // Replace with your database name
    const collection = database.collection('question'); // Replace with your collection name

    const filter = {
      "_id": new ObjectId(questionID),
      "answers.createDate": answerCreateDate,
      "answers.emailCreator": emailCreator
    };

    const update = {
      $push: {
        "answers.$.likes": emailLiker
      }
    };

   console.log( await collection.updateOne(filter, update));

    // console.log("Email added to likes array successfully.");

    client.close();
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

// Usage example
LikeAnswer("6495ae37565d5c5dd7dce343", 1687625467962, "tienntse161099@fpt.edu.vn", "newemail@example.com");
