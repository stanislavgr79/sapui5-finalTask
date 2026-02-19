sap.ui.define([], function () {
    "use strict";

    const Validate = {
        validateStringState: function (sValue) {
            if (typeof sValue !== "string") {
                return false;
            }
            return sValue.trim().length > 0;
        },

        validateNumberState: function (vValue) {
            if (vValue === null || vValue === undefined || vValue === "") {
                return false;
            }
            const nValue = Number(vValue);
            return !isNaN(nValue) && nValue >= 0;
        },

        validateDateState: function (sValue) {
            if (sValue instanceof Date) {
                return !isNaN(sValue.getTime());
            }
            if (typeof sValue !== "string") {
                return false;
            }
            if (sValue.trim() === "") {
                return false;
            }
            const oDate = new Date(sValue);
            return !isNaN(oDate.getTime());
        },

        validateForm: function (oView, sModelName) {
            const oValidate = oView.getModel(sModelName).getProperty("/validate");
            return Object.entries(oValidate)
                .filter(([key]) => key !== "isFormValid")
                .every(([, value]) => value === true);
        }
    };

    return Validate;
});
