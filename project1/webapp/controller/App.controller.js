sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("project1.controller.App", {
        onInit() {
            const oViewModel = new JSONModel({
                layout: "OneColumn",
                busy: false,
                delay: 0
            });

            this.setModel(oViewModel, "appView");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
        },

        _onBeforeRouteMatched(oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const oViewModel = this.getModel("appView");

            if (sRouteName === "RouteMain") {
                oViewModel.setProperty("/layout", "OneColumn");
            } else if (sRouteName === "RouteCreate" || sRouteName === "RouteDetail") {
                oViewModel.setProperty("/layout", "TwoColumnsBeginExpanded");
            }
        }
    });
});
