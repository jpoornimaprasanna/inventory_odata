sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, MessageToast, JSONModel, History, UIComponent) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.EmployeePage", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("EmployeePage").attachMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oData = this.getOwnerComponent().getModel();
			var oArg = oEvent.getParameters("arguments");
			this.id = oArg.arguments.obj;
			oData.read("/EmployeeInfoSet('" + this.id + "')", {
				success: function (odata, oResponse) {
					//var emp = odata.results;
					var data = new JSONModel();
					data.setData(odata);
					this.getView().setModel(data);
					console.log("success");
				}.bind(this),
				error: function (oEve) {
					console.log("error");
				}.bind(this)
			});
		},
		onPressStatus: function (oEvent) {
			var id = this.getView().byId("Id").getProperty("text");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("StatusPage", {
				obj: id
			});
			this.getView().getModel("data").setProperty("/allExtraInfo/0/statusType", "Emphasized");
		},
		reset: function () {
			this.getView().byId("desId").setValue("");
			this.getView().byId("comboId").setSelectedItem(null);
			/*this.getView().byId("DP2").setValue(null);*/
		},
		onSubmit: function (oEvent) {
			var oData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZINVENTORY_SRV");
			debugger
			var description = this.getView().byId("desId").getValue();
			var Issue = this.getView().byId("comboId").getValue();
			var ticketNo = Math.floor((Math.random() * 10000000000) + 1);
			var empName = this.getView().byId("name").getProperty("text");
			var id = this.getView().byId("Id").getProperty("text");
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yy = today.getFullYear();

			// var date = 
			if (mm.length == 1) {
				mm = "0" + mm;
			}
			var date = dd + "-" + mm + "-" + yy;
			this.obj = {
				"Issuedescription": description,
				"Issue": Issue,
				"Ticketno": ticketNo,
				"Ename": empName,
				"Eid": id,
				"Submitingdate": date,
				"Issuestatus": "TL-InProcess",
				"Tlstatus": "TL-InProcess",
				"Buttonenable": "true",
				"Hrstatus": "waiting"
				//"Tlstatusicon": "sap-icon://status-in-process",
				//"Hrstatusicon": "sap-icon://lateness"
			};
			oData.create("/zinNotificationSet", this.obj, {
				success: function (odata) {
					alert("success");
				}.bind(this),
				error: function (oresponse) {
					alert(oresponse.message + +oresponse.name);
				}.bind(this)
			});
			this.obj1 = {
				"Issuedescription": description,
				"Issue": Issue,
				"Ticketno": ticketNo,
				"Eid": id,
				"Submitingdate": date,
				// "Issuestatus": "TL-InProcess",
				"Tlstatus": "TL-InProcess",
				// "Buttonenable": "true",
				"Tlstatusicon": "sap-icon://status-in-process",
				"Hrstatusicon": "sap-icon://lateness",
				"Hrstatus":"HR-Waiting"
			};

			oData.create("/zinStatusSet", this.obj1, {
				success: function (odata) {
					alert("success");
				}.bind(this),
				error: function (oresponse) {
					alert(oresponse.message + +oresponse.name);
				}.bind(this)
			});

		},
		onChange: function (oEvent) {
			this.comboValue = oEvent.getParameters().value;
		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("login");	
			this.getView().byId("bell").setVisible(false);
		},
		empNotification: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("emp_Notification");
			this.getView().getModel("data").setProperty("/allData/0/notifSymb", "");
			this.getView().getModel("data").setProperty("/notifications/0/notifType1", "Default");

		},
		/*onNotifClick: function (oEvent) {
					// create popover
					if (!this._oPopover) {
						this._oPopover = sap.ui.xmlfragment("inventory.Inventory.view.notifPopover", this);
						this.getView().addDependent(this._oPopover);
						this._oPopover.bindElement("data>/notifications");
					}

					this._oPopover.openBy(oEvent.getSource());
					this.getView().getModel("data").setProperty("/allData/0/notifSymb", "");
				}*/
	});
});