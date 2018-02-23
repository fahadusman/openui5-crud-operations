sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("crud.App", {

        onInit: function () {
            var oBusinessPartnerTable = sap.ui.getCore().byId("collectionTableID");
            var oModel = oBusinessPartnerTable.getModel();
            var FilterOperator = sap.ui.model.FilterOperator;

            this.getView().setModel(oModel);
        },

        UpdateSelectedProduct: function () {
            var oProductsTable = sap.ui.getCore().getElementById('ProductsTableID');
            var selectedIndex = oProductsTable.getSelectedIndex();
            if (selectedIndex == -1) {
                alert("Please Select a row from Product Table to Update");
                return;
            }

            var oModel = oProductsTable.getModel();

            var selectedRow = oProductsTable.getRows()[selectedIndex];
            var selectedId = selectedRow.getCells()[0].getValue();

            var oMeta = oModel.getServiceMetadata();
            var objectDeclaratoin = "";

            var addComma = false;
            for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
                var property = oMeta.dataServices.schema[0].entityType[1].property[i];
                if(addComma) objectDeclaratoin += ",";
                objectDeclaratoin += property.name + ":\"" + selectedRow.getCells()[i].getValue() + "\"";
                addComma = true;
            }
            var oData;
            eval('oData = {' + objectDeclaratoin + '};');

            oModel.update("/ProductSet('" + selectedId + "')", oData, {
                merge: true,
                success: function () {
                    alert("Product updated successfully.");
                },
                error: function (oError) {
                    alert("failed to udpate the product.");
                }
            });
        },

        UpdateProductDialog: function () {
            var oProductsTable = sap.ui.getCore().getElementById('ProductsTableID');
            var selectedIndex = oProductsTable.getSelectedIndex();
            if (selectedIndex == -1) {
                alert("Please Select a row from Product Table to Update");
                return;
            }

            var oModel = oProductsTable.getModel();

            var selectedRow = oProductsTable.getRows()[selectedIndex];
            var selectedId = selectedRow.getCells()[0].getValue();

            var oMeta = oModel.getServiceMetadata();

            //create dialog box for editing product details.
            var oProductDetailsDialog = new sap.m.Dialog("DialogProductDetails", {
                title: "Update Product Info",
                modal: true,
                contentWidth: "2em",
                closed: function (oControlEvent) {
                    sap.ui.getCore().getElementById('DialogProductDetails').destroy();
                },
                content: [
                    new sap.m.Button("btnProductDetailsCancel", {
                        text: "Cancel",
                        tap: [this.Cancel, this]
                    }),
                    new sap.m.Button("btnProductDetailsUpdate", {
                        text: "Update",
                        tap: [this.UpdateProductData, this]
                    }),
                ]
            });

            var oProductDetailsList = new sap.m.List({
                id: "ListProductDetails",
                title: "Product Details",
            });
            oProductDetailsList.setModel(oModel);

            var objectDeclaratoin = "";
            var addComma = false;
            for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
                var property = oMeta.dataServices.schema[0].entityType[1].property[i];
                if (addComma) objectDeclaratoin += ",";
                objectDeclaratoin += property.name + ":\"" + selectedRow.getCells()[i].getValue() + "\"";
                addComma = true;

                var oInput = new sap.m.Input({
                    value: selectedRow.getCells()[i].getValue(),
                    width: "150px",
                    editable: (i == 0 || i == 2) ? false : true //Preserve productId and Category
                });
                oProductDetailsList.addItem(new sap.m.InputListItem({
                    label: property.name,
                    content: oInput,
                }));
            }
            var oData;
            eval('oData = {' + objectDeclaratoin + '};');

            oProductDetailsDialog.addContent(oProductDetailsList);
            oProductDetailsDialog.open();

            oProductDetailsDialog.open();
        },
        UpdateProductData: function () {
            var oProductsTable = sap.ui.getCore().getElementById('ProductsTableID');
            var selectedIndex = oProductsTable.getSelectedIndex();
            var oModel = oProductsTable.getModel();

            var selectedRow = oProductsTable.getRows()[selectedIndex];
            var selectedId = selectedRow.getCells()[0].getValue();

            var oProductsDetailsDialog = sap.ui.getCore().getElementById('DialogProductDetails');
            var oProductsDetailsList = sap.ui.getCore().getElementById('ListProductDetails');

            var oMeta = oModel.getServiceMetadata();
            var objectDeclaratoin = "";
            var addComma = false;
            for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
                var property = oMeta.dataServices.schema[0].entityType[1].property[i];
                if (addComma) objectDeclaratoin += ",";
                objectDeclaratoin += property.name + ":\"" +
                    oProductsDetailsList.getItems()[i].getContent()[0].getValue() + "\"";
                addComma = true;
            }
            var oData;
            eval('oData = {' + objectDeclaratoin + '};');


            oModel.update("/ProductSet('" + selectedId + "')", oData, {
                merge: true,
                success: function () {
                    alert("Successfully updated the Product.");
                    oProductsDetailsDialog.destroy();
                },
                error: function (oError) {
                    alert("Failed to udpate.");
                }
            });

        },

        PartnerDetails: function () {
            var partnerId = sap.ui.getCore().byId("inputPartnerId");
            var sPartnerId = partnerId.getValue();
            var oBusinessPartnerTable = sap.ui.getCore().byId("collectionTableID");

            // Filter the DATA
            var oModel = oBusinessPartnerTable.getModel();
            var FilterOperator = sap.ui.model.FilterOperator;
            console.log(sPartnerId);
            var filter = new sap.ui.model.Filter("BusinessPartnerID", FilterOperator.EQ, sPartnerId);

            //Bind the Data to the Table
            oBusinessPartnerTable.bindRows("/BusinessPartnerSet", null, null, [filter]);

            var oProductsTable = sap.ui.getCore().byId("ProductsTableID");
            oProductsTable.bindRows("/BusinessPartnerSet('" + sPartnerId + "')/ToProducts", null, null, null);
        },

        Cancel: function () {

            sap.ui.getCore().byId("DialogProductDetails").destroy();

        }
    });
});