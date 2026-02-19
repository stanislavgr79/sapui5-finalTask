sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../validate/validateProductV2"
], function (Controller, validateProductV2) {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {
        onInit: function () {
            this._oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this._oRouter = this.getOwnerComponent().getRouter();
        },
        getModel: function (sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _validateSubmitNewProduct: function (oNewProduct) {
            validateProductV2.callValidateId.call(this, oNewProduct.ID);
            validateProductV2.callValidateName.call(this, oNewProduct.Name);
            validateProductV2.callValidateDescription.call(this, oNewProduct.Description);
            validateProductV2.callValidateReleaseDate.call(this, oNewProduct.ReleaseDate);
            validateProductV2.callValidatePrice.call(this, oNewProduct.Price);
            validateProductV2.callValidateRating.call(this, oNewProduct.Rating);
            return validateProductV2.validateForm.call(this);
        },

        _resetValidateProductState: function () {
            const oModel = this.getModel("modelV2");
            oModel.setProperty("/validate", {
                isValidId: true,
                isValidName: true,
                isValidDescription: true,
                isValidReleaseDate: true,
                isValidPrice: true,
                isValidRating: true,
                isFormValid: true
            });
        }
    });
});
