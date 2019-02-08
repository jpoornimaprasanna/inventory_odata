sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.StatusPage", {
		onInit: function () {
			this.getView().setModel(new JSONModel(), "data");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("StatusPage").attachMatched(this._onObjectMatched, this);
			this.getView().byId("SimpleFormDisplay").setVisible(false);
		},
		_onObjectMatched: function (oEvent) {
			
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel());
			 var oData = this.getOwnerComponent().getModel();
			var oArg = oEvent.getParameters("arguments");
			this.id= oArg.arguments.obj;
			
			var a= new Filter({
				path: "Eid",
				operator: FilterOperator.EQ,
				value1: this.id
			});
			var filter = [];
			filter.push(a);
			// var filterVal = {
			// 	filters: filter
			// };
			
			oData.read("/zinStatusSet('"+ this.id +"')",{
			//	filters:filter,
				success: function(odata){
					 //this.getView().setModel(odata);
				console.log("success");	
				},
				error: function(oEve){
				console.log("error");	
				}
			});
			
			
			
			
			// var model23=this.getOwnerComponent().getModel("data");
			// this.getView().setModel(model23);
			// this.getView().getModel("data").setProperty("/odata/visible1",false);
		},
		onSearch: function (oEvent) {
			var olist = this.getView().byId("list1"),
				arr = [],
				binding,
				filters;
			filters = new Filter({
				filters: [new Filter("ticketNo", FilterOperator.Contains, oEvent.getSource().getValue()),
					new Filter("Date", FilterOperator.Contains, oEvent.getSource().getValue())
				],
				and: false
			});
			binding = olist.getBinding("items");
			arr.push(filters);
			binding.filter(arr);
			binding.filter(arr);
		},
		onItemPressed: function (oEvent) {
			this.getView().byId("emptyId").setVisible(false);
			this.getView().byId("SimpleFormDisplay").setVisible(true);
			var obj = oEvent.getParameters().listItem.getBindingContext().getObject(),
				oDetails = this.getView().getModel("data");
				oDetails.setProperty("/Status",obj);
		
		},
		onClick: function (oEvent) {
			var path = this.getView().getBindingContext().sPath.substring();
			var index = path.substring(path.lastIndexOf('/') + 1);
			var oModel = this.getView().getParent().getModel("data").oData.empInfo;
			for (var i = 0; i < oModel.length; i++) {
				if (oModel[i].id === index) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("EmployeePage", {
						obj: i
					});
				}
			}

		},
		onLogout : function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("login");	
					this.getView().byId("bell").setVisible(false);
		}
		
	});

});