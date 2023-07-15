// const { connect } = require('../configs/MongoDB');
var { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dotien_admin:loginto123@orchids-db.09jmkh4.mongodb.net/?retryWrites=true&w=majority";

async function connect(databaseName, collectionName) {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    // Define a close function to close the MongoDB connection
    const close = async () => {
        setTimeout(() => { client.close() }, 1500)
    };

    return {
        collection,
        close
    };
}


// Get account information
async function GetListDonation(amount, sortDirection) {
    const { collection, close } = await connect('orchids-1', 'donation');
    const result = await collection.find().sort({ 'vnd': sortDirection }).limit(amount).toArray();
    close();
    return result;
}

module.exports = {
    GetListDonation,
}