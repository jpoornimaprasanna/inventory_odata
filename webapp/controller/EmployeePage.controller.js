sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast,JSONModel) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.EmployeePage", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("EmployeePage").attachMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
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
			var oldLength1 = this.getView().getModel("data").getProperty("/allData/").length;
			var empDescription = this.byId("desId").getValue();
			var id = this.getView().byId("Id").getProperty("text");
			var ticketNo = Math.floor((Math.random() * 10000000000) + 1);
			var desig = this.getView().byId("desig").getProperty("text");
			var empName = this.getView().byId("name").getProperty("text");
			var inprocess = "sap-icon://status-in-process";
			var waiting = "sap-icon://lateness";
			var TlInprocess = "Tl Inprocess";
			var HRWaiting = "HR Waiting";
			var enable = false;
			var enable1=true;
			var enable2=true;
			var enable3=true;
			var rejDec = "";
			var visible = false;
			var tlRejDec = "";
			var vis1 = false;
			var vis2 = false;
			var active = "*";
			var stIcon = "sap-icon://process";
			var atText = "TL Inprocess";
			var state = "Warning";
			var symb = "";
			var time = "";
			var today = new Date();
			var dd = today.getDate();
			var posi = 0;
			var posi1 = 1;
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			today = dd + '-' + mm + '-' + yyyy;
			this.obj = {
				issue: this.comboValue,
				description: empDescription,
				Date: today,
				id: id,
				name: empName,
				Designation: desig,
				ticketNo: ticketNo,
				tlInprocess: inprocess,
				tlInprocessText: TlInprocess,
				hrWaitins: waiting,
				hrWaitingText: HRWaiting,
				enable: enable,
				enable1:enable1,
				enable2:enable2,
				enable3:enable3,
				tlRejDec: rejDec,
				visible: visible,
				hrRejDec: tlRejDec,
				vis: vis1,
				no: active,
				staIcon: stIcon,
				staText: atText,
				state: state,
				notifSymb: symb,
				date1: dd,
				issueTime: time,
				visible1: vis2,
				position: posi,
				position1: posi1
			};
			var myArray = [];
			var newData = [],
				newArray = [];
			var oModel = this.getView().getModel("data");
			var oData = this.getView().getModel("data").oData;
			for (var i = 0; i < oData.status[0][id].length; i++) {
				myArray.push(oData.status[0][id][i]);
			}
			if (empDescription === "" && this.comboValue === undefined) {
				MessageToast.show("Please enter all the Feilds");
			}
			if (myArray.length > 7) {
				MessageToast.show("You exceed the limit of Issues raised");
			} else if (empDescription !== "" && this.comboValue !== "") {
				myArray.push(this.obj);
				oModel.setProperty("/status/0/" + id, myArray);
				myArray = oModel.getProperty("/status/0/" + id, myArray);
				var index=myArray.length-1;
				oModel.setProperty("/status/0/" + id, myArray);
				MessageToast.show("Your Complaint Has Been Received");
				/*var oData = this.getView().getModel("data").oData;*/
				var allData = this.getView().getModel("data").oData.allData;
				for (var j = 0; j < oData.allData.length; j++) {
					newData.push(oData.allData[j]);
					
					var oldLength = oData.allData.length;
				}
				newData.unshift(this.obj);
				var newLength = newData.length;
				this.getView().getModel("data").setProperty("/empInfo/0/notif", "*");
				this.getView().getModel("data").setProperty("/allData/", newData);
				for (var k = 0; k < oData.notifications.length; k++) {
					newArray.push(oData.notifications[k]);

				}
				if (this.obj.Designation != "Team Lead") {
					newArray.unshift(this.obj);
					this.getView().getModel("data").setProperty("/notifications/", newArray);
					this.getView().getModel("data").setProperty("/allData/0/notifSymb", "*");
					this.getView().getModel("data").setProperty("/notifications/0/notifType1", "Reject");
				
				}
				if (this.obj.Designation === "Team Lead") {
					this.getView().getModel("data").setProperty("/allData/0/staText/", "HR Inprocess");
					this.getView().getModel("data").setProperty("/allData/0/enable/", true);
					this.getView().getModel("data").setProperty("/allData/0/enable1", false);
					this.getView().getModel("data").setProperty("/status/0/"+id+"/"+index+"/position1",0);
					this.getView().getModel("data").setProperty("/status/0/"+id+"/"+index+"/hrWaitins","sap-icon://status-in-process");
					this.getView().getModel("data").setProperty("/status/0/"+id+"/"+index+"/hrWaitingText","HR Inprocess");

				}
			}
			/*if (newLength > oldLength) {
				var notNo = newLength - oldLength;
				this.getView().getModel("data").setProperty("/allData/0/notifSymb", "*");
			}*/

			this.reset();
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

		},/*onNotifClick: function (oEvent) {
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