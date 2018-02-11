const MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://127.0.0.1/socketchat';

/*
* Connect to MongoDB
*/
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log('Connected to MongoDB');

    // Set db constants
    const socketchat = db.db('socketchat');
    const users = socketchat.collection('users');
    const messages = socketchat.collection('messages');

});