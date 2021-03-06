sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.login", {
		onInit: function () {

		},
		// onSubmit: function (oEvent) {
		// 	var oDataModel = this.getOwnerComponent().getModel("data");
		// 	   this.getView().setModel(oDataModel);
		// 	var oModel = this.getView().getModel("data").oData.empInfo;
		// 	for (var i = 0; i < oModel.length; i++) {
		// 		/*get the values from the input feild*/
		// 		var oId = this.getView().byId("Id").getValue();
		// 		var oPassword = this.getView().byId("Password").getValue();
		// 		if (oId === "" && oPassword === "") {
		// 			MessageToast.show("Please enter the Id and Password");
		// 			this.getView().byId("Id").setValueState("Error");
		// 			this.getView().byId("Password").setValueState("Error");
		// 			break;
		// 		} else if (oId == "SE1111" && oPassword == "admin") {
		// 			var id = this.getView().byId("Id").getValue();
		// 			var model = this.getView().getModel("data").getProperty("/empInfo");
		// 			for (i = 0; i < model.length; i++) {
		// 				if (id === model[i].id) {
		// 					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 					oRouter.navTo("AdminPage", {
		// 						obj: i
		// 					});
		// 				}
		// 			}
		// 			this.getView().byId("Id").setValueState("None");
		// 			this.getView().byId("Password").setValueState("None");
		// 			this.getView().byId("Id").setValue("");
		// 			this.getView().byId("Password").setValue("");
		// 			break;
		// 		} else if (oModel[i].id === oId && oModel[i].password === oPassword) {
		// 			var id = this.getView().byId("Id").getValue();
		// 			var model = this.getView().getModel("data").getProperty("/empInfo");
		// 			for (i = 0; i < model.length; i++) {
		// 				if (id === model[i].id) {
		// 					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 					oRouter.navTo("main", {
		// 						obj: i
		// 					});
		// 					break;
		// 				}
		// 			}
		// 			this.getView().byId("Id").setValueState("None");
		// 			this.getView().byId("Password").setValueState("None");
		// 			this.getView().byId("Id").setValue("");
		// 			this.getView().byId("Password").setValue("");
		// 			this.getView().getModel("data").setProperty("/allExtraInfo/0/popNotif",false);
		// 			break;
		// 		} else if (oModel[i].id !== oId && oModel[i].password === oPassword) {
		// 			MessageToast.show("Please enter valid Id");
		// 			this.getView().byId("Id").setValueState("Error");

		// 		} else if (oModel[i].password !== oPassword && oModel[i].id === oId) {
		// 			MessageToast.show("Please enter valid Password");
		// 			this.getView().byId("Password").setValueState("Error");
		// 		}
		// 	}
		// },
		checkValidation: function (oEvent) {

		},
		onSubmit: function () {
			var Empid = this.getView().byId("Id").getValue();
			var pwd = this.getView().byId("Password").getValue();
			var oData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZINVENTORY_SRV");
			oData.read("/EmployeeInfoSet", {
				success: function (odata, oResponse) {
					var idLen = odata.results.length;
					for (var i = 0; i < idLen; i++) {
						if(Empid === "" && pwd === "" ){
							MessageToast.show("Please enter the Id and Password");
							this.getView().byId("Id").setValueState("Error");
							this.getView().byId("Password").setValueState("Error");
						}else if(Empid === "SE1111" && pwd === "admin"){
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("AdminPage", {
								obj: "SE1111"
							});
							break; 
						}
						else if (Empid === odata.results[i].Eid && pwd === odata.results[i].Epassword) {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("main", {
								obj: odata.results[i].Eid
							});
							break;
						 }
					}
				}.bind(this),
				error: function (err) {
					console.log(err);
				}
			});
			// this._model = new sap.ui.model.odata.ODataModel(oData, true);
			// this.getView().setModel(this._model);
		}
	});
});