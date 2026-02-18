sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/BindingMode",
    "project1/model/models"
], (UIComponent, BindingMode, models) => {
    "use strict";

    return UIComponent.extend("project1.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // ensure v2 model uses two-way binding for edit/create scenarios
            const oV2Model = this.getModel("v2");
            if (oV2Model) {
                oV2Model.setDefaultBindingMode(BindingMode.TwoWay);
            }

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the v2 validation model
            this.setModel(models.productModelV2(), "modelV2");

            // enable routing
            this.getRouter().initialize();
        }
    });
});