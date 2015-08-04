var ChatModel = Backbone.Model.extend({});
var SettingsModel = Backbone.Model.extend({});
var chatEvents = _.extend({}, Backbone.Events);
chatEvents.on('pushMessage',function(data){
	console.log(data);
	socket.emit('chatMessageToServer', data);
})

var ChatCollection = Backbone.Collection.extend({
	model: ChatModel	
});

// var SettingsCollection = Backbone.Collection.extend({
// 	model: SettingsModel
// });


var SettingsPageModel = Backbone.Model.extend({
	defaults:{
		settingsModel: new SettingsModel(
			{nickName: "TestNick", bgColor: "testColor"}
		)
	},
	initialize:function(params){
		this.evnt = params.evnt;
		this.evnt.on('connect',function(data){
			this.set('nickName',data);
		},this);
		this.evnt.on('nickChanged',function(data){
			this.evnt.trigger('rename',data);
									
		},this);
		//console.log(this.get('settingsCollection').toJSON());
	}
});


var ChatRoomModel = Backbone.Model.extend({
	defaults: {
	    userChat: new ChatCollection()
		},
	initialize:function(params){
		this.evnt = params.evnt;
		this.evnt.on('connect',function(data){
			this.set('username',data);
			this.get('userChat').add(
				{ sender: username, message: '...connecting to chat server...'}
			);
		},this);
		
		this.evnt.on('joined', function(data) {
			console.log(data);
	      this.get('userChat').add(
	        { sender: data.username, message: 'has joined the chat'}
	      );
	    }, this);
		this.evnt.on('addMsg',function(data){
			this.applyMsg(data);
		},this);
		 this.evnt.on('left', function(data) {
	     	this.applyMsg({ sender: data.username, message: "has left"});
	    },this);
		this.evnt.on('changed', function(data){
			this.set('username',data.newName);
		},this);
		this.evnt.on('notice', function(data){
			this.applyMsg({sender: "system", message: data})
		},this);
	},
	applyMsg: function(data){
		this.get('userChat').add(new ChatModel(
			{sender: data.sender, message: data.message}
			));
	}
});
