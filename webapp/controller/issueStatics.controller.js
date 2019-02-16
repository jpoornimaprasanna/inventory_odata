sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.AdminPage", {
		onInit: function() {
	       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("issueStatics").attachPatternMatched(this._onObjectMatched1, this);
			},
			_onObjectMatched1: function (oEvent) {
			debugger
			if(this.getView().byId("idYear")){
				this.getView().byId("idYear").setSelectedKey("");	
			}
			if(this.getView().byId("idStatus")){
				this.getView().byId("idStatus").setSelectedKey("");	
			}
			if(this.getView().byId("chartContainer")){
				this.getView().byId("chartContainer").setVisible(false);	
			}
			
		},
		oChangeYearOrMonth: function (oEvent) {
			var changeValue = this.getView().byId("idData").getProperty("value");
			if (changeValue == "Year") {
				this.getView().byId("idYear").setVisible(true);
				this.getView().byId("idMonth").setVisible(false);
				this.getView().byId("idStatus").setVisible(true);
			} else {
				this.getView().byId("idYear").setVisible(false);
				this.getView().byId("idMonth").setVisible(true);
				this.getView().byId("idStatus").setVisible(true);
			}
		},
		oSubmitPress: function () {
			/*var check = this.getView().byId("idData").getProperty("value");
			if (check == "Year") {
				var main = this.getView().byId("idData").getProperty("value");
				var year = this.getView().byId("idYear").getProperty("value");
				var status = this.getView().byId("idStatus").getProperty("value");
			} else {
				var main = this.getView().byId("idData").getProperty("value");
				var year = this.getView().byId("idMonth").getProperty("value");
				var status = this.getView().byId("idStatus").getProperty("value");
			}
			this.getView().byId("issueFragment").bindData("data>/" + main + "/0/" + status + "/0/" + year);*/
			if(this.getView().byId("chartContainer")){
				this.getView().byId("chartContainer").setVisible(true);	
			}
			var year = this.getView().byId("idYear").getProperty("value");
			var status = this.getView().byId("idStatus").getProperty("value");
			var a = new Filter({
				path: "Year2",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: year
			});
			var filter = [];
			filter.push(a);
			var b = new Filter({
				path: "Year1",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: year
			});
			var filter1 = [];
			filter1.push(b);
			if (status == "Approved") {
				var oModel1 = this.getOwnerComponent().getModel();
				oModel1.read("/ChartSet", {
					filters: filter1,
					success: function (odata) {
						debugger
						var graph = odata.results;
						/*this.getView().byId("issueFragment").setValue("/ChartSet");*/
						var jmodel = this.getView().getModel("data");
						jmodel.setProperty("/equipData", graph);
						/*this.getView().byId("name1").setValue("{data>Month1}");
						this.getView().byId("name2").setValue("{data>Count1}");*/
					}.bind(this),
					error: function (oresponse) {
						debugger
					}.bind(this)
				});
			} else {
				var oModel2 = this.getOwnerComponent().getModel();
				oModel2.read("/ChartRejSet", {
					filters: filter,
					success: function (odata) {
						debugger
						var graph1= odata.results;
                       	var jmodel = this.getView().getModel("data");
						jmodel.setProperty("/equipData", graph1);
					/*	this.getView().byId("name1").setValue("Month2");
						this.getView().byId("name2").setValue("Count2");*/

					}.bind(this),
					error: function (oresponse) {
						debugger
					}.bind(this)
				});
			}
		},
		chartType: function (oEvent) {
			var chartName = oEvent.getParameters().value;
			this.getView().byId("idVizFrame").setVizType(chartName);

		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
			this.getView().byId("bell").setVisible(false);
		}

	});

});