window.LandingView = Backbone.View.extend({

	initialize : function() {
		// this.render();
	},

	events : {

	},

	render : function() {
		$(this.el).html(this.template());
		return this;
	}
});
