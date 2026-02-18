sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/base/util/deepClone"
], (BaseController, JSONModel, MessageBox, MessageToast, Fragment, deepClone) => {
    "use strict";

    return BaseController.extend("project1.controller.ObjectDetail", {
        onInit() {
            BaseController.prototype.onInit.call(this);
            const oRouter = this._oRouter;
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onRouteMatched, this);
            this._bEditMode = false;
            this._oCurrentFragment = null;
            this._oOriginalData = null;
        },

        _onRouteMatched(oEvent) {
            const sProductId = oEvent.getParameter("arguments").productId;
            if (!sProductId) {
                return;
            }

            this._resetValidateProductState();
            this._bEditMode = false;
            this._resetEditMode();

            const oModel = this.getModel("v2");
            const sPath = oModel.createKey("/Products", { ID: sProductId });
            this._sProductPath = sPath;

            oModel.read(sPath, {
                success: function (oData) {
                    const oCleanData = this._removeODataMetadata(oData);
                    const oEditModel = new JSONModel(oCleanData);
                    this._oOriginalData = deepClone(oCleanData);
                    this.getView().setModel(oEditModel, "edit");
                    this._loadDetailFragment("DetailRead");
                }.bind(this),
                error: function () {
                    MessageBox.error(this._oBundle.getText("updateErrorMessage"));
                }.bind(this)
            });
        },

        _removeODataMetadata(oData) {
            const oCleanData = {};
            for (const key in oData) {
                if (Object.prototype.hasOwnProperty.call(oData, key) && !key.startsWith("__")) {
                    oCleanData[key] = oData[key];
                }
            }
            return oCleanData;
        },

        _loadDetailFragment(sFragmentName) {
            const sFragmentPath = `project1.view.fragments.${sFragmentName}`;
            const oContainer = this.getView().byId("detailFormContainer");

            // Удаляем старый фрагмент полностью
            if (this._oCurrentFragment) {
                this._oCurrentFragment.destroy();
                this._oCurrentFragment = null;
            }

            Fragment.load({
                name: sFragmentPath,
                controller: this
            }).then((oFragment) => {
                this._oCurrentFragment = oFragment;
                oContainer.removeAllItems();
                oContainer.addItem(oFragment);
            }).catch((oError) => {
                MessageBox.error("Ошибка загрузки формы: " + oError.message);
            });
        },

        onEditToggleButtonPress() {
            const oObjectPage = this.getView().byId("ObjectPageLayout");
            this._bEditMode = !this._bEditMode;

            if (this._bEditMode) {
                this._loadDetailFragment("DetailEdit");
                oObjectPage.setShowFooter(true);
            } else {
                this._resetEditChanges();
                this._loadDetailFragment("DetailRead");
                oObjectPage.setShowFooter(false);
            }
        },

        onCloseDetail() {
            this.onNavBack();
        },

        onNavBack() {
            this._resetEditMode();
            this._oRouter.navTo("RouteMain");
        },

        onSave() {
            const oEditModel = this.getView().getModel("edit");
            const oEditedProduct = oEditModel.getData();
            if (!this._validateSubmitNewProduct(oEditedProduct)) {
                return;
            }

            const oPayload = Object.assign({}, oEditedProduct);

            const oModel = this.getModel("v2");
            oModel.update(this._sProductPath, oPayload, {
                success: function () {
                    MessageToast.show(this._oBundle.getText("updateSuccessMessage"));
                    oModel.refresh(true);
                    this._bEditMode = false;
                    this._resetEditMode();
                    this._loadDetailFragment("DetailRead");
                }.bind(this),
                error: function () {
                    MessageBox.error(this._oBundle.getText("updateErrorMessage"));
                }.bind(this)
            });
        },

        onDelete() {
            MessageBox.confirm(this._oBundle.getText("confirmDeleteMessage"), 
            {
                title: this._oBundle.getText("confirmTitle"),
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,

                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.YES) {
                        return;
                    }

                    const oModel = this.getModel("v2");

                    oModel.remove(this._sProductPath, {
                        success: function () {
                            MessageToast.show(this._oBundle.getText("deleteSuccessMessage"));
                            this.getOwnerComponent().getRouter().navTo("RouteMain");
                        }.bind(this),
                        error: function () {
                            MessageBox.error(this._oBundle.getText("deleteErrorMessage"));
                        }.bind(this)
                    });
                }.bind(this)
            });
        },

        // Сброс изменений при редактировании
        onResetChanges() {
            MessageBox.confirm(this._oBundle.getText("confirmResetMessage"), 
            {
                title: this._oBundle.getText("confirmTitle"),
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.YES) {
                        return;
                    }

                    this._resetEditChanges();
                }.bind(this)
            });
        },

        _resetEditChanges() {
            const oEditModel = this.getView().getModel("edit");
            // Если модель или оригинальные данные недоступны, ничего не делаем
            if (!oEditModel || !this._oOriginalData) {
                return;
            }

            // Сбрасываем данные модели к оригинальным данным,
            // используя глубокое клонирование для предотвращения мутаций
            const oResetData = deepClone(this._oOriginalData);
            oEditModel.setData(oResetData, true);
            this._resetValidateProductState();
        },

        // Сброс режима редактирования и удаление фрагмента
        _resetEditMode() {
            const oObjectPage = this.getView().byId("ObjectPageLayout");
            // Скрываем футер и сбрасываем состояние кнопки редактирования
            if (oObjectPage && oObjectPage.getShowFooter()) {
                oObjectPage.setShowFooter(false);
            }
            const oEditToggleBtn = this.getView().byId("editToggleBtn");
            // Сбрасываем состояние кнопки редактирования, если она была нажата
            if (oEditToggleBtn && oEditToggleBtn.getPressed()) {
                oEditToggleBtn.setPressed(false);
            }
            // Удаляем текущий фрагмент, если он существует
            if (this._oCurrentFragment) {
                this._oCurrentFragment.destroy();
                this._oCurrentFragment = null;
            }
            // Сбрасываем флаг режима редактирования
            this._bEditMode = false;
        }
    });
});
