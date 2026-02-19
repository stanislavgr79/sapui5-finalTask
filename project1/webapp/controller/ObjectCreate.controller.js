sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.ObjectCreate", {
        onInit() {
            BaseController.prototype.onInit.call(this);
            const oRouter = this._oRouter;
            oRouter.getRoute("RouteCreate").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
            this._resetValidateProductState();

            const oModel = this.getModel("v2");
            if (this._oCreatedContext) {
                oModel.deleteCreatedEntry(this._oCreatedContext);
            }

            // Get next product ID from database
            this._getNextProductId(oModel, (iNextId) => {
                const oContext = oModel.createEntry("/Products", {
                    inactive: true,
                    properties: {
                        ID: iNextId,
                        Name: "",
                        Description: "",
                        ReleaseDate: null,
                        Price: 0,
                        Rating: 0
                    }
                });

                this._oCreatedContext = oContext;
                this.getView().setBindingContext(oContext, "v2");
            });
        },

        _getNextProductId(oModel, fnCallback) {
            // Fetch all products to find max ID
            oModel.read("/Products", {
                success: function (oData) {
                    let iMaxId = 0;
                    if (oData.results && Array.isArray(oData.results)) {
                        oData.results.forEach((product) => {
                            if (product.ID > iMaxId) {
                                iMaxId = product.ID;
                            }
                        });
                    }
                    fnCallback(iMaxId + 1);
                }.bind(this),
                error: function () {
                    // If error, start with ID = 1
                    fnCallback(1);
                }.bind(this)
            });
        },

        onNavBack() {
            this._oRouter.navTo("RouteMain");
        },

        onCloseCreate() {
            this._cleanupCreatedEntry(true);
            this.onNavBack();
        },

        onSave() {
            const oContext = this.getView().getBindingContext("v2");
            const oNewProduct = oContext.getObject();
            if (!this._validateSubmitNewProduct(oNewProduct)) {
                return;
            }

            const oModel = this.getModel("v2");
            oModel.submitChanges({
                success: function () {
                    oModel.refresh(true);
                    MessageToast.show(this._oBundle.getText("addSuccessMessage"));
                    this._cleanupCreatedEntry(false);
                    this.getOwnerComponent().getRouter().navTo("RouteMain");
                }.bind(this),
                error: function () {
                    MessageBox.error(this._oBundle.getText("addErrorMessage"));
                }.bind(this)
            });
        },

        onReset() {
            this._resetFormData();
            this._resetValidateProductState();
        },

        _resetFormData() {
            const oContext = this.getView().getBindingContext("v2");
            if (oContext) {
                oContext.getModel().setProperty(oContext.getPath() + "/Name", "");
                oContext.getModel().setProperty(oContext.getPath() + "/Description", "");
                oContext.getModel().setProperty(oContext.getPath() + "/ReleaseDate", null);
                oContext.getModel().setProperty(oContext.getPath() + "/Price", 0);
                oContext.getModel().setProperty(oContext.getPath() + "/Rating", 0);
            }
        },

        _cleanupCreatedEntry(bDelete = true) {
            if (!this._oCreatedContext) {
                return;
            }

            if (bDelete) {
                const oModel = this.getModel("v2");
                oModel.deleteCreatedEntry(this._oCreatedContext);
            }

            this._oCreatedContext = null;
            this.getView().setBindingContext(null, "v2");
        }
    });
});
