var { MongoClient } = require('mongodb');

const ONLINE = "mongodb+srv://dotien_admin:loginto123@orchids-db.09jmkh4.mongodb.net/?retryWrites=true&w=majority";
const LOCAL = "mongodb://0.0.0.0:27017";

const useOnline = false;

function getURI() {
    if(useOnline) {
        // console.log("##### Using online database");
        return ONLINE;
    } else {
        // console.log("##### Using local database");
        return LOCAL;
    }
}

const databaseName = 'orchids-1';

// create the connection to MongoDB
async function connect(databaseName, collectionName) {
    const client = new MongoClient(getURI());
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    
    // Define a close function to close the MongoDB connection
    const close = async () => {
        setTimeout(() => {client.close()}, 1500)
    };
    
    return {
      collection,
      close
    };
  }
  

async function getQuestionsCollection() {
    return await connect(databaseName, 'question');
}

async function getPostsCollection() {
    return await connect(databaseName, 'post');
}

async function getTeamsCollection() {
    return await connect(databaseName, 'teams');
}

async function getAccountsCollection() {
    return await connect(databaseName, 'account');
}

module.exports = {
    connect,
    getQuestionsCollection,
    getPostsCollection,
    getTeamsCollection,
    getAccountsCollection
}