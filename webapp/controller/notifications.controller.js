sap.ui.define([  
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/m/MessageToast",
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("inventory.Inventory.controller.AdminPage", {
		onInit: function () {
			// var oModel = new JSONModel(jQuery.sap.getModulePath("inventory.Inventory", "/data.json"));
			// this.getView().setModel(oModel);
			
			
			this.getView().setModel(new JSONModel(), "jmodel");
			//window.location.reload();
			 var oDataModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oDataModel);
            oDataModel.read("/AdminNotificationSet", {
                success: function (odata) {
                    debugger
                    /*var adminNotif = odata.results;
                    var model = new JSONModel();
                    model.setData(adminNotif);
                    this.getView().setModel(model,"data1");*/
                    /*this.getView().setModel(model,"/notif");
                    var notif;*/
                }.bind(this),
                  error: function (oresponse) {
                    debugger
                }.bind(this)
            });
		}/*,
		onBeforeRendering: function () {
			var alldata = this.getView().getModel("data").getProperty("/allData/");
			for (var i = 0; i < alldata.length; i++) {
				var tNo = alldata[i].ticketNo;
				var nId = alldata[i].id;
				var status1 = this.getView().getModel("data").getProperty("/status/0/" + nId);
				var issueRejDate = alldata[i].Date;
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
						1) || issueYear1 < currYear ) {
					alldata.splice(i, 1);
					i--;
					for (var j = 0; j < status1.length; j++) {
						if (status1[j].ticketNo === tNo) {
							this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + j + "/issueTime", "Minimum issue time has Expired ");
							this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + j + "/visible1", true);
						}
					}
				}
			}
		}*/,
		onEventPress: function (oEvent) {
			var twoColumn = this.getView().byId("idFlexibleColumn");
			twoColumn.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
			this.obj = oEvent.getParameters().listItem.getBindingContext().getObject();
			var jmodel = this.getView().getModel("data");
			jmodel.setProperty("/notiData", this.obj);
			this.getView().byId("beginPage").setShowFooter(true);
		/*	var singleObject = oEvent.getParameters().listItem.getBindingContext().getObject();
			this.getView().setModel("data1",singleObject);*/
		},
		onClosingDetail: function () {
			var oneColumn = this.getView().byId("idFlexibleColumn");
			oneColumn.setLayout(sap.f.LayoutType.OneColumn);
			this.getView().byId("beginPage").setShowFooter(false);
		},
		onSearch: function () {
			var aFilter = [];
			var sQuery = this.getView().byId("input").getValue();
			if (sQuery) {
				aFilter.push(new Filter("ticketNo", FilterOperator.Contains, sQuery));
			}
			var oList = this.getView().byId("notfList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onReject: function () {
			var oView = this.getView();
			var oDialog = oView.byId("idHrDialog");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "inventory.Inventory.view.hrRejectDescription", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		onHrRejectClose: function () {
			this.getView().byId("idHrDialog").close();
			var tNo = this.obj.ticketNo;
			var nId = this.obj.id;
			var empObj = this.getView().getModel("data").getProperty("/status/0/" + nId);
			var alldata = this.getView().getModel("data").getProperty("/allData/");
			var tlRejDec = this.getView().byId("idHrRejDec").getProperty("value");
			this.getView().getModel("data").setProperty("/allExtraInfo/0/statusType", "Accept");
			for (var i = 0; i < empObj.length; i++) {
				if (empObj[i].ticketNo === tNo) {
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/hrRejDec", tlRejDec);
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/vis", true);
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/hrWaitins", "sap-icon://decline");
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/hrWaitingText", "HR Rejected");
				}
			}
			for (var k = 0; k < alldata.length; k++) {
				if (alldata[k].ticketNo === tNo) {
					this.getView().getModel("data").setProperty("/allData/" + k + "/staIcon", "sap-icon://decline");
					this.getView().getModel("data").setProperty("/allData/" + k + "/staText", "HR Rejected");
					this.getView().getModel("data").setProperty("/allData/" + k + "/state", "Error");
					this.getView().getModel("data").setProperty("/allData/" + k + "/enable2", false);
				}
			}
			MessageToast.show("Issue Has Been Rejected");
		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
			this.getView().byId("bell").setVisible(false);
		},
		onHrAccept: function () {
			var tNo = this.obj.ticketNo;
			var nId = this.obj.id;
			var empObj = this.getView().getModel("data").getProperty("/status/0/" + nId);
			var alldata = this.getView().getModel("data").getProperty("/allData/");
			this.getView().getModel("data").setProperty("/allExtraInfo/0/statusType", "Accept");
			for (var i = 0; i < empObj.length; i++) {
				if (empObj[i].ticketNo === tNo) {
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/hrWaitins", "sap-icon://accept");
					this.getView().getModel("data").setProperty("/status/0/" + nId + "/" + i + "/hrWaitingText", "HR Accepted");
				}
			}
			for (var j = 0; j < alldata.length; j++) {
				if (alldata[j].ticketNo === tNo) {
					this.getView().getModel("data").setProperty("/allData/" + j + "/staIcon", "sap-icon://accept");
					this.getView().getModel("data").setProperty("/allData/" + j + "/staText", "HR Accepted");
					this.getView().getModel("data").setProperty("/allData/" + j + "/state", "Success");
					this.getView().getModel("data").setProperty("/allData/" + j + "/enable2", false);

				}
			}
			MessageToast.show("Issue Has Been Approved");
		}

	});

});