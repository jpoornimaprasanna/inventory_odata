sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, History, UIComponent) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.StatusPage", {
		onInit: function () {
			this.getView().setModel(new JSONModel(), "data");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("StatusPage").attachMatched(this._onObjectMatched, this);
			this.getView().byId("SimpleFormDisplay").setVisible(false);
		},
		_onObjectMatched: function (oEvent) {
		    var oData = this.getOwnerComponent().getModel();
			var oArg = oEvent.getParameters("arguments");
			this.id= oArg.arguments.obj;
			
			var a= new Filter({
				path: "Eid",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.id
			});
			var filter = [];
			filter.push(a);
			// var filterVal = {
			// 	filters: filter
			// };
			// ('"+ this.id +"')
			oData.read("/zinStatusSet",{
				filters:filter,
				success: function(odata){
				this.getView().getModel("data").setProperty("/stat1",odata);
				console.log("success");	
				}.bind(this),
				error: function(oEve){
				console.log("error");	
				}.bind(this)
			});
		},
		onSearch: function (oEvent) {
			var oData = this.getOwnerComponent().getModel();
			var val = oEvent.getSource().getValue();             
			
			
			var a= new Filter({
				path: "ticketNo",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: val
			});
			var filter = [];
			filter.push(a);
			// var filterVal = {
			// 	filters: filter
			// };
			// ('"+ this.id +"')
			oData.read("/zinStatusSet",{
				filters:filter,
				success: function(odata){
				this.getView().getModel("data").setProperty("/stat1",odata);
				console.log("success");	
				}.bind(this),
				error: function(oEve){
				console.log("error");	
				}.bind(this)
			});
		},
		onItemPressed: function (oEvent) {
			this.getView().byId("emptyId").setVisible(false);
			this.getView().byId("SimpleFormDisplay").setVisible(true);
			var obj = oEvent.getParameters().listItem.oBindingContexts.data.getObject();
			// var obj = oEvent.getParameters().listItem.getBindingContext().getObject(),
				var oDetails = this.getView().getModel("data");
				oDetails.setProperty("/Stat1",obj);
		},
		onClick: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("overview", {}, true);
			}

		},
		onLogout : function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("login");	
					this.getView().byId("bell").setVisible(false);
		}
		
	});

});