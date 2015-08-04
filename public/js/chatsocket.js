var username = "debug"//prompt();


var socket = io();



socket.on('connect',function(){
	socket.emit('newUser',username);
	chatEvents.trigger('connect',username);
});
socket.on('joined',function(data){
	chatEvents.trigger('joined',data);
});
socket.on('left',function(data){
	chatEvents.trigger('left',data);
});
socket.on('chatMessageFromServer',function(data){
	chatEvents.trigger('addMsg',data);
});
socket.on('nickNameChanged',function(data){
	chatEvents.trigger('changed',data);
});

socket.on('noticeRename',function(data){
	var msg = data.prevName + " renamed to " + data.newName;
	chatEvents.trigger('notice',msg);
});