$(function () {

    // Connect to socket.io
    var socket = io.connect('http://127.0.0.1:4000');

    /*
    * Enter chat and load users
    */
    $("a#enterChat").click(function (e) {
        e.preventDefault();

        let username = $("#username").val();

        localStorage.setItem("username", username);

        if (username != "") {

            socket.emit("username", username);

            $("div#enterUsername").addClass('hidden');
            $("div#chatMain").removeClass('hidden');

        } else {
            alert('You must enter a username!')
        }

    });

    /*
    * Handle log on
    */
    socket.on('logon', function (data) {
        $("div#userList ul").append('<li id="' + data.socketID + '">' + data.username + '<li>'); //</li> !!!!!
    });

});