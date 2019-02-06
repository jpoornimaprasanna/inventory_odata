sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.main", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf inventory.Inventory.view.main
		 */
		onInit: function () {

		},
		complainForm: function(){
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("EmployeePage");
		},
		Status: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("StatusPage");	
		}

	});

});