//const MongoClient = require('mongodb').MongoClient;
const io = require('socket.io').listen(4000);
const mongoose = require("mongoose");
const users = require('./models/User');
const messages = require('./models/Message');
const db = require("./config/keys").mongoURI;


mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



/*
* Connect to socket.io
*/
io.on('connection', function (socket) {

    console.log('Connected to socket.io, ID: ' + socket.id);

    /*
    * Handle enter chat / log on
    */
    socket.on("username", function (username) {

        users.find(function (err, res) {
            if (err) throw err;
            socket.emit('users', res); 
        });

        messages.find(function (err, res) {
            if (err) throw err;
            socket.emit('messages', res); 
        });

        const newUser = new users({
            socketID: socket.id, 
            username: username
        });

        newUser.save();

        socket.broadcast.emit('logon', {
            socketID: socket.id,
            username: username
        });
    });

    /*
    * Handle log off
    */
    socket.on('disconnect', function () {
        console.log('User ' + socket.id + ' disconnected!');

        users.deleteOne({socketID: socket.id}, function () {
            socket.broadcast.emit('logoff', socket.id);
        });

        users.count(function(err, res) {
            if (err) throw err;
            if( res == 0)
                messages.remove({});
        })
    });

    /*
    * Handle chat input
    */
    socket.on('input', function (data) {

        if (data.publicChat) {
            const newMessage = new messages({
                username: data.username,
                message: data.message
            });

            newMessage.save();
        }

        io.emit('output', data);
    });

    /*
    * Handle second user trigger
    */
    socket.on('secondUserTrigger', function (data) {
        socket.to(data.secondUserID).emit('secondUserChatWindow', data);
    });

});