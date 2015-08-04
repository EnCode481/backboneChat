
var MessageLiView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#messageTemplate').html()),
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},
	
	render: function(){
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});

var MessagesUlView = Backbone.View.extend({
	tagName: 'ul',
	className: 'messages',
	
	initialize: function(){
		this.listenTo(this.collection, 'add', this.render);
		this.listenTo(this.collection, 'remove', this.render);
		this.render();
	},
	render: function(){
		var self = this;
		this.$el.html(this.collection.map(function(data){
			return new MessageLiView({model: data}).render().$el;
		}));
	}
	
});

var ChatView = Backbone.View.extend({
	el: '#here',
	events:{
		'click .send-btn' : 'submitMsg',
		'submit .send-form': 'submitMsg'
	},
	initialize: function(params){
		this.evnt = params.evnt;
		this.messagesUlView = new MessagesUlView({collection: this.model.get('userChat')});
		this.listenTo(this.model.get('userChat'),'add', this.scroll);
		this.render();
	},
	template: _.template( $('#main').html()),
	
	scroll: function() {
    	this.$('.messages').scrollTop( $('.messages')[0].scrollHeight );
 	},
	render: function(){
		this.$el.html(this.template({}));
		$('#messages').html(this.messagesUlView.el);
		this.$('.messages').css('height', $(window).height()/1.5);
		
	},
	submitMsg: function() {
		var message = this.$('#messageInput').val();
		
		if(message.length != 0){ 
			this.$('#messageInput').val('');
			this.evnt.trigger('pushMessage', {sender: this.model.get('username'), message: message });
			console.log('test');
			this.evnt.trigger('addMsg', {sender: this.model.get('username'), message:message});
		}
	}
});

var SettingsPageView = Backbone.View.extend({
	el:$('#test'),
	events:{
		'click .edit-btn' : 'editSettings',
		'click .confirm-btn': 'confirmSettings'	,
		'click .cancel-btn': 'cancel'
	},
	initialize:function(){
		//this.settingsView = new SettingsView({collection: this.model.get('settingsCollection')});
		this.settingsModel = this.model.get('settingsModel');
		this.render();
	},
	template: _.template($('#settingsViewTemplate').html()),
	render: function(){
		this.$el.html(this.template(this.settingsModel.toJSON()));
		return this;
	},
	editSettings: function(){
		this.$('.confirm-btn').show();
		this.$('.cancel-btn').show();
		this.$('.edit-btn').hide();
		this.nickName = this.$('.nickNameStg').html();
		this.bgColor = this.$('.bgColorStg').html();
		this.$('.nickNameStg').html('<input type="text" class="form-control nickName-update" value="'+
			this.nickName +'">');
		this.$('.bgColorStg').html('<input type="text" class="form-control bgColor-log" value="' +
		this.bgColor +'"><input type="text" class="bgColorSpectrum"/>');
		$(".bgColorSpectrum").spectrum({
		    color: "#f00",
		    change: function(color) {
		        $(".bgColor-log").val(color.toHexString());
		    }
		});
	},
	confirmSettings: function(){
		this.$('.confirm-btn').hide();
		console.log(this.model);
		var newNickName = $('.nickName-update').val();
		var newBgColor = $('.bgColor-update').val();
		if(this.nickName != newNickName){
		this.settingsModel.set('nickName',newNickName);
		this.nickName = newNickName;
		socket.emit('changeNickName',this.settingsModel.get('nickName'));
		}
		
		this.settingsModel.set('bgColor',newBgColor);
		
		this.bgColor = newBgColor;
		this.render();
	},
	cancel: function(){
		this.render();
	}
});

// var SettingsItems = Backbone.View.extend({
// 	initialize: function(){
// 		
// 	},
// 	render:function(){
// 		console.log(this.collection.toArray());
// 	}
// });


// var SettingsView = Backbone.View.extend({ //2
// 	el:$('#settingsList'),
// 	initialize:function(){
// 		console.log(this.collection);
// 		this.render();
// 	},
// 	render: function(){
// 		// var self = this;
// 		// _.each(this.model.toArray(),function(data){
// 		// 	self.$el.append((new SettingsItemsView({ model: data})).render().$el);
// 		// })
// 		this.$el.html(this.collection.map(function(data){
// 			return new SettingsItemsView({model: data}).render().$el;
// 		}));
// 		console.log(this.el);
// 		return this;
// 	}
// });
// 
// var SettingsItemsView = Backbone.View.extend({
// 	tagName: 'tr',
// 	initialize: function(){
// 		console.log("from settings items");
// 		console.log(this.model.toJSON());
// 		this.template = _.template($('#settingsTemplate').html());
// 	},
// 	render: function(){
// 		this.$el.html(this.template(this.model.toJSON()));
// 		return this;
// 	}
// });

var chatModel = new ChatRoomModel({ evnt: chatEvents });
var chatView = new ChatView({model: chatModel,  evnt: chatEvents });

var settingsPageModel = new SettingsPageModel({ evnt: chatEvents});
var settingsPageView = new SettingsPageView({model: settingsPageModel , chatModel : chatModel});

