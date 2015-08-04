var express = require('express');

var port = 3000;
var app = express();

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

var usernames = {};
var clientNumber = 0;

io.on('connection', function(socket){
	socket.on('newUser',function(username){
		socket.username = username;
		socket.usernameId = clientNumber.toString();
		clientNumber +=1;
		console.log(username + clientNumber.toString() + " has connected");
		 socket.broadcast.emit('joined', {
	      username: socket.username
	    });
	});
	socket.on('chatMessageToServer',function(data){
		console.log(data);
		socket.broadcast.emit('chatMessageFromServer',data);
	});
	socket.on('disconnect',function(){
		clientNumber -= 1;
		console.log(socket.username + ' has disconnected.');
		socket.broadcast.emit('left',{ username: socket.username});
	});
	socket.on('changeNickName',function(data){
		var prevName = socket.username;
		socket.username = data;
		console.log(prevName + "changed to " + data);
		socket.emit('nickNameChanged', { newName: data, prevName: prevName});
		socket.broadcast.emit('noticeRename', { newName: data, prevName: prevName});
	})
});