sap.ui.define([
    "./validate"
], function (validate) {
    "use strict";

    const _updateFormState = function (oView) {
        oView.getModel("modelV2").setProperty(
            "/validate/isFormValid",
            validate.validateForm(oView, "modelV2")
        );
    };

    const ValidateProductV2 = {
        onValidateId: function (oEvent) {
            const vValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidateId.call(this, vValue);
        },

        onValidateName: function (oEvent) {
            const sValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidateName.call(this, sValue);
        },

        onValidateDescription: function (oEvent) {
            const sValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidateDescription.call(this, sValue);
        },

        onValidateReleaseDate: function (oEvent) {
            const oValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidateReleaseDate.call(this, oValue);
        },

        onValidatePrice: function (oEvent) {
            const vValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidatePrice.call(this, vValue);
        },

        onValidateRating: function (oEvent) {
            const vValue = oEvent.getSource().getValue();
            ValidateProductV2.callValidateRating.call(this, vValue);
        },

        callValidateId: function (vValue) {
            const bValid = validate.validateNumberState(vValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidId", bValid);
            _updateFormState(oView);
        },

        callValidateName: function (sValue) {
            const bValid = validate.validateStringState(sValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidName", bValid);
            _updateFormState(oView);
        },

        callValidateDescription: function (sValue) {
            const bValid = validate.validateStringState(sValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidDescription", bValid);
            _updateFormState(oView);
        },

        callValidateReleaseDate: function (oValue) {
            const bValid = validate.validateDateState(oValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidReleaseDate", bValid);
            _updateFormState(oView);
        },

        callValidatePrice: function (vValue) {
            const bValid = validate.validateNumberState(vValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidPrice", bValid);
            _updateFormState(oView);
        },

        callValidateRating: function (vValue) {
            const bValid = validate.validateNumberState(vValue);
            const oView = this.getView();
            oView.getModel("modelV2").setProperty("/validate/isValidRating", bValid);
            _updateFormState(oView);
        },

        validateForm: function () {
            return validate.validateForm(this.getView(), "modelV2");
        }
    };

    return ValidateProductV2;
});
