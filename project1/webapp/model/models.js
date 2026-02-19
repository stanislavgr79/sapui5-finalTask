sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        productModelV2: function () {
            var oModel = new JSONModel({
                selectedItems: 0,
                validate: {
                    isValidId: true,
                    isValidName: true,
                    isValidDescription: true,
                    isValidReleaseDate: true,
                    isValidPrice: true,
                    isValidRating: true,
                    isFormValid: true
                }
            });
            return oModel;
        }
    };

});