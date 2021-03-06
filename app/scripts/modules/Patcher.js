define([
	'application',
	'backbone',
	'controllers/Patcher',
],
function(app, Backbone, PatcherController){
    'use strict';

	var Patcher = function PatcherConstructor(Patcher, Parent) {

		this.Controller = new PatcherController(Parent.patcherRegion);

		this.addInitializer($.proxy(this.Controller.attachMainViews, this.Controller));
	};

	return Patcher;
});
