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
			var oModelData = this.getOwnerComponent().getModel();
			this.oData = oModelData;
			oModelData.read("/zinNotificationSet",{
                success: function (odata) {
                	var equip = odata.results;
                    this.getView().getModel("data").setProperty("/empNotif",equip);
                }.bind(this),
                  error: function (oresponse) {
                }.bind(this)
            }
			);
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
			var updateStatus = {
                	Tlstatus:"TL Rejected",
			     	Hrstatus:"HR Blocked",
			     	Tlstatusicon:"sap-icon://decline",
			     	Hrstatusicon:"sap-icon://cancel"
			     };
			     var tcNo = this.obj.Ticketno;
			var id = this.obj.Eid;
			     var oData1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZINVENTORY_SRV");
			     oData1.update("/zinStatusSet(Eid='"+id+"',Ticketno='"+tcNo+"')",updateStatus, {
				success: function (odata) {	},
				error: function (oresponse) { }
			});
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
		onApproved: function (evt) {
			var tcNo = this.obj.Ticketno;
			var id = this.obj.Eid;
			var issue = this.obj.Issue;
			var issueDec = this.obj.Issuedescription;
			var date = this.obj.Submitingdate;
			var issueStatus = this.obj.Issuestatus;
			var oData = this.getOwnerComponent().getModel();
			var obj1 ={
				Eid :id,
				Eticketno:tcNo,
				Issue:issue,
				Issuedesc:issueDec,
				Issuedate:date,
				Tlstatus:"TL ACCEPTED",
				Hrstatus:"HR INPROCESS",
				ISSUESTATUS:issueStatus,
			};
			
			var updatedObj = {
                	Tlstatus:"TL ACCEPTED",
			     	Hrstatus:"HR INPROCESS",
			     	Tlstatusicon:"sap-icon://accept",
			     	Hrstatusicon:"sap-icon://status-in-process"
			     };
                var button={
                Buttonenable : "false"	
                };
			oData.create("/AdminNotificationSet",obj1 , {
                    success:function(odata){
                       MessageToast.show("Issue Has Been Approved");
                    }.bind(this),
                    error:function(oresponse){
                       
                    }.bind(this)
                });
                var oData1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZINVENTORY_SRV");
                oData1.update("/zinStatusSet(Eid='"+id+"',Ticketno='"+tcNo+"')",updatedObj, {
				success: function (odata) {	},
				error: function (oresponse) { }
			});
			oData1.update("/zinNotificationSet(Eid='"+id+"',Ticketno='"+tcNo+"')",button, {
				success: function (odata) {
				
				},
				error: function (oresponse) { }
			});
		}
	});
});