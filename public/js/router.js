var ViewManager = {
    currentView : null,
    showView : function(view) {
        if (this.currentView !== null && this.currentView.cid != view.cid) {
            this.currentView.remove();
        }
        this.currentView = view;
        return view.render();
    }
}

var AppRouter = Backbone.Router.extend({
	routes:{
		'settings':'settings',
        '': 'home'
	},
	settings: function(){
		console.log("works!");
        $(chatView.el).hide();
        $(settingsPageView.el).show();
        
	},
    home: function(){
        console.log("home");
        $(settingsPageView.el).hide();
        $(chatView.el).show();
    }
});

var app_router = new AppRouter;


Backbone.history.start();