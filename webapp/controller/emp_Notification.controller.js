sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, History) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.emp_Notification", {

		onInit: function () {
			/*this.getView().setModel(new JSONModel(), "data");*/
			this.getView().byId("emptyId").setVisible(true);
			this.getView().byId("SimpleFormDisplay").setVisible(false);
			
		},
		onBeforeRendering: function () {
			var notification = this.getView().getModel("data").getProperty("/notifications/");
			for (var i = 0; i < notification.length; i++) {
				var tNo = notification[i].ticketNo;
				var nId = notification[i].id;
				var status1 = this.getView().getModel("data").getProperty("/status/0/" + nId);
				var issueRejDate = notification[i].Date;
				var issueDate = issueRejDate.slice(0, 2);
				var issueDate1 = parseInt(issueDate);
				var issueMonth = issueRejDate.slice(3, 5);
				var issueMonth1 = parseInt(issueMonth);
				var issueYear = issueRejDate.slice(6,11);
				var issueYear1 = parseInt(issueYear);
				var todaysDate = new Date();
				var currYear = todaysDate.getFullYear();
				var todaysDay = todaysDate.getDate();
				var month = todaysDate.getMonth() + 1;
				var preIssueDate1 = (31 - issueDate1) + todaysDay;
				if ((todaysDay - 5 > issueDate1 && issueMonth1 == month) || (issueMonth1 == month - 1 && preIssueDate1 > 6) || (issueMonth1 < month -
						1) || issueYear1 < currYear  ) {
					notification.splice(i, 1);
					i--;
					for (var j = 0; j < status1.length; j++) {
						if (status1[j].ticketNo === tNo) {
							this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + j + "/issueTime", "Minimum issue time has Expired ");
							this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + j + "/visible1", true);
						}
					}
				}
			}
		},

		onReject: function () {
			var oView = this.getView();
			var oDialog = oView.byId("idTlDialog");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "inventory.Inventory.view.tlDescription", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		onTlRejectSubmit: function () {
			/*this.getView().byId("idTlDialog").close();*/
			var id = this.obj.id;
			var alldata = this.getView().getModel("data").getProperty("/allData/");
			var rejStatus = this.getView().getModel("data").getProperty("/status/0/" + id);
			var tcNo = this.obj.ticketNo;
			this.decTa = this.getView().byId("idTlRejDec").getProperty("value");
			if(this.Designation != "Team Lead"){
				this.getView().getModel("data").setProperty("/allExtraInfo/0/statusType", "Accept");
			}
			for (var k = 0; k < alldata.length; k++) {
				if (alldata[k].ticketNo === tcNo) {
					this.getView().getModel("data").setProperty("/allData/" + k + "/tlRejDec", this.decTa);
					this.getView().getModel("data").setProperty("/allData/" + k + "/tlInprocessText", "TL Rejected");
					this.getView().getModel("data").setProperty("/allData/" + k + "/visible", true);
					this.getView().getModel("data").setProperty("/allData/" + k + "/staIcon", "sap-icon://decline");
					this.getView().getModel("data").setProperty("/allData/" + k + "/staText", "TL Rejected");
					this.getView().getModel("data").setProperty("/allData/" + k + "/state", "Error");
					this.getView().getModel("data").setProperty("/allData/" + k + "/enable3", false);
				}
			}
			for (var z = 0; z < rejStatus.length; z++) {
				if (rejStatus[z].ticketNo === tcNo) {
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + z + "/tlInprocess", "sap-icon://decline");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + z + "/tlInprocessText", "TL Rejected");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + z + "/hrWaitins", "sap-icon://unlocked");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + z + "/hrWaitingText", "HR Locked");
				}
			}
			if(this.decTa === ""){
				MessageToast.show("Enter Valid Reason");
			}else {
				MessageToast.show("Issue Has Been Rejected");
				this.getView().byId("idTlDialog").close();
			}
		},
		onTlRejectClose : function(){
			this.getView().byId("idTlDialog").close();
		},
		onClick: function (oEvent) {
			window.history.go(-1);
		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
			this.getView().byId("bell").setVisible(false);
		},
		onItemPressed: function (oEvent) {
			this.getView().byId("emptyId").setVisible(false);
			this.getView().byId("SimpleFormDisplay").setVisible(true);
			this.obj = oEvent.getParameters().listItem.getBindingContext("data").getObject();
			var oDetails = this.getView().getModel("data");
			oDetails.setProperty("/odata", this.obj);
			this.Designation = this.getView().byId("idDesig").getText();
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
		onApproved: function () {
			var tcNo = this.obj.ticketNo;
			var id = this.obj.id;
			var ctid = this.getView().getModel("data").getProperty("/status/0/" + id);
			var alldata = this.getView().getModel("data").getProperty("/allData/");
			if(this.Designation != "Team Lead"){
				this.getView().getModel("data").setProperty("/allExtraInfo/0/statusType", "Accept");
			};
			for (var i = 0; i < ctid.length; i++) {
				if (ctid[i].ticketNo === tcNo) {
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + i + "/tlInprocess", "sap-icon://accept");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + i + "/tlInprocessText", "TL Accepted");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + i + "/hrWaitins", "sap-icon://status-in-process");
					this.getView().getModel("data").setProperty("/status/0/" + id + "/" + i + "/hrWaitingText", "HR Inprocess");
				}
			}
			for (var j = 0; j < alldata.length; j++) {
				if (alldata[j].ticketNo === tcNo) {
					this.getView().getModel("data").setProperty("/allData/" + j + "/enable", true);
					this.getView().getModel("data").setProperty("/allData/" + j + "/enable1", false);
					this.getView().getModel("data").setProperty("/allData/" + j + "/tlInprocessText", "TL Accepted");
					this.getView().getModel("data").setProperty("/allData/" + j + "/staIcon", "sap-icon://accept");
					this.getView().getModel("data").setProperty("/allData/" + j + "/staText", "TL Accepted");
					this.getView().getModel("data").setProperty("/allData/" + j + "/state", "Success");
					this.getView().getModel("data").setProperty("/allData/" + j + "/enable3", false);
				}
			}
			MessageToast.show("Issue Has Been Approved");
		}
	});
});