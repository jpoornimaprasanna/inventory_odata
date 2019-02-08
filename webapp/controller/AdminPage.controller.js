sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel'
], function (Controller, Filter, FilterOperator, JSONModel) {
	"use strict";
	return Controller.extend("inventory.Inventory.controller.AdminPage", {
		onInit: function () {
			/*var oModel = new JSONModel(jQuery.sap.getModulePath("inventory.Inventory", "/data.json"));
			this.getView().setModel(oModel);
			this.getView().setModel(new JSONModel(), "jmodel");*/
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("AdminPage").attachPatternMatched(this._onObjectMatched, this);
			var oModel1 = this.getOwnerComponent().getModel();
			oModel1.read("/EmployeeInfoSet", {
                success: function (odata) {
                	 debugger
                	var equip = odata.results;
                   /* var model = new JSONModel();
                    model.setData(euip);
                    this.getView().setModel(model,"equipment");*/
                    var jmodel = this.getView().getModel("data");
			jmodel.setProperty("/equipData", equip);
                	//**/*this.getView().setModel(odata.results*/*/);*/
                   
                }.bind(this),
                  error: function (oresponse) {
                    debugger
                }.bind(this)
            });
            oModel1.read("/AdminNotificationSet", {
                success: function (odata) {
                	 debugger
                	var equip1 = odata.results;
                   /* var model = new JSONModel();
                    model.setData(euip);
                    this.getView().setModel(model,"equipment");*/
                    var jmodel = this.getView().getModel("data");
			jmodel.setProperty("/issueStatus", equip1);
                	//**/*this.getView().setModel(odata.results*/*/);*/
                   
                }.bind(this),
                  error: function (oresponse) {
                    debugger
                }.bind(this)
            });
			
			
		},
		_onObjectMatched: function (oEvent) {
			var oArg = oEvent.getParameters("arguments");
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel("data"));
			oView.bindElement("/empInfo/" + oArg.arguments.obj);
		},
		equipment: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("idEquipmentDialog");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "inventory.Inventory.view.equipment", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		onEquipmentDialogClose: function () {
			this.getView().byId("idEquipmentDialog").close();
		},
		issueDetails: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("idIssueDetailsDialog");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "inventory.Inventory.view.issueDetails", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		onIssueDetailsDialogClose: function () {
			this.getView().byId("idIssueDetailsDialog").close();
		},
		onissueStatics: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("issueStatics");
		},
		notifications: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("notifications");
			this.getView().getModel("data").setProperty("/allData/0/notifSymb", "");
			this.getView().getModel("data").setProperty("/empInfo/0/notif", "");
		},
		onEmpEquSearch: function () {
			var aFilter = [];
			var sQuery = this.getView().byId("input").getValue();
			if (sQuery) {
				aFilter.push(new Filter("id", FilterOperator.Contains, sQuery));
			}
			var oList = this.getView().byId("idEquipmentTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onNotifClick: function (oEvent) {
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("inventory.Inventory.view.notifPopover", this);
				this.getView().addDependent(this._oPopover);
				this._oPopover.bindElement("data>/notifications");
			}

			this._oPopover.openBy(oEvent.getSource());
			this.getView().getModel("data").setProperty("/allData/0/notifSymb", "");
		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
			this.getView().byId("bell").setVisible(false);
		},
		onSearchByTno: function () {
			var aFilter = [];
			var sQuery = this.getView().byId("input1").getValue();
			if (sQuery) {
				aFilter.push(new Filter("ticketNo", FilterOperator.Contains, sQuery));
			}
			var oList = this.getView().byId("idIssueDetailsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onRegister: function(){
			var oView = this.getView();
			var oDialog = oView.byId("idSignUpDialog");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "inventory.Inventory.view.SignUp", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
	    onSubmit: function () {
			this.getView().byId("idSignUpDialog").close();
		},
		onSignup: function () {
			var empId = this.getView().byId("idEmpId").getValue();
			var empName = this.getView().byId("idEmpName").getValue();
			var empDes = this.getView().byId("idEmpDesig").getValue();
			var password = this.getView().byId("idPass").getValue();
			var email = this.getView().byId("idEmail").getValue();
			var number = this.getView().byId("idNum").getValue();
			var sysNo = this.getView().byId("idSysNo").getValue();
			var DOB = this.getView().byId("idDob").getValue();
			var oData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZINVENTORY_SRV");
			var obj1 = {
				"Eid" : empId,
				"Ename":empName,
				"Edesig":empDes, 
				"Epassword":password,
				"Email":email,
				"Phoneno":number,
				"Systemno":sysNo,
				"Edob":DOB
			};
			oData.create("/EmployeeInfoSet",obj1 , {
                    success:function(odata){
                        debugger;
                    },
                    error:function(oresponse){
                        debugger;
                    }
                })

		}
	});

});