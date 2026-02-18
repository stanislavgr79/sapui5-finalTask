sap.ui.define([
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, Sorter, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
        onInit() {
            BaseController.prototype.onInit.call(this);
            this._aFilters = [];
            this._aOriginalSorters = [];
        },

        onFilterProductsByName(oEvent) {
            const sValue = oEvent.getParameter("value");
            const oTable = this.byId("productsTable");
            const oBinding = oTable.getBinding("items");

            this._aFilters = [];
            if (sValue) {
                this._aFilters.push(
                    new Filter("Name", FilterOperator.Contains, sValue)
                );
            }

            oBinding.filter(this._aFilters);
        },

        onSortingByColumn(oEvent) {
            const sKey = oEvent.getParameter("selectedItem").getKey();
            const oTable = this.byId("productsTable");
            const oBinding = oTable.getBinding("items");
            let aSorters = [];

            if (sKey !== "none") {
                aSorters.push(new Sorter(sKey, false));
            }
            oBinding.sort(aSorters);
        },

        onAddRecord() {
            console.log("Add Record button pressed");
            this.getOwnerComponent().getRouter().navTo("RouteCreate");
        },

        onProductPress(oEvent) {
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext("v2");
            if (!oContext) {
                return;
            }

            const sProductId = oContext.getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                productId: sProductId
            });
        }
    });
});