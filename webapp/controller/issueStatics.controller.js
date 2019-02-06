sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.AdminPage", {
		//	onInit: function() {
		//
		//	},
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
			var check = this.getView().byId("idData").getProperty("value");
			if (check == "Year") {
				var main = this.getView().byId("idData").getProperty("value");
				var year = this.getView().byId("idYear").getProperty("value");
				var status = this.getView().byId("idStatus").getProperty("value");
			} else {
				var main = this.getView().byId("idData").getProperty("value");
				var year = this.getView().byId("idMonth").getProperty("value");
				var status = this.getView().byId("idStatus").getProperty("value");
			}
			this.getView().byId("issueFragment").bindData("data>/" + main + "/0/" + status + "/0/" + year);
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