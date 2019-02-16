sap.ui.define(function () {
	"use strict";
	var button = {
		statusText: function (sStateValue) {
			switch (sStateValue) {
			case "false":
				return false;
			case "true":
				return true;
			}
		}
	};
	return button;
}, /* bExport= */ true);