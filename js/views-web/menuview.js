window.MenuView = Backbone.View.extend({

	initialize : function() {
		// this.render();
	},
	
	events : {
		"click a": "sendMain"
	},

	sendMain : function(){
		window.heightForContent = $("input").val();
	},
	
	render : function() {
		$(this.el).html(this.template());
		$(this.el).find("input").val($(window).height());
		return this;
	}
});
