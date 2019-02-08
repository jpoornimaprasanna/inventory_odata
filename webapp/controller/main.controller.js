sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller,JSONModel) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.main", {

		onInit: function () {
			 var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			 oRouter.getRoute("main").attachMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent){
		    var oData = this.getOwnerComponent().getModel();
			var oArg = oEvent.getParameters("arguments");
			this.id= oArg.arguments.obj;
			oData.read("/EmployeeInfoSet('"+this.id+"')",{
				success: function(odata, oResponse){
					//var emp = odata.results;
					var data = new JSONModel();
					data.setData(odata);
					this.getView().setModel(data);
				console.log("success");	
				}.bind(this),
				error: function(oEve){
				console.log("error");	
				}.bind(this)
			});
			},
		
		complainForm: function(){
			var id = this.id;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("EmployeePage", {obj:id});
		},
		Status: function(){
			var id = this.id;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("StatusPage", {obj:id});	
		}

	});

});