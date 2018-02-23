sap.ui.jsview("crud.App", {
    getControllerName: function () {
        return "crud.App";
    },

    createContent: function (oController) {
        var sServiceUrl = "https://sapes4.sapdevcenter.com/sap/opu/odata/IWBEP/GWSAMPLE_BASIC";
        //        var oModel = new sap.ui.model.odata.v2.ODataModel({
        var oModel = new sap.ui.model.odata.ODataModel({
            serviceUrl: sServiceUrl,
        });

        var layout = new sap.ui.commons.layout.MatrixLayout({
            id: 'matrix4',
            layoutFixed: false,
            width: "100%"
        });

        var appHeader = new sap.ui.commons.ApplicationHeader('appHeader', {
            logoText: "CRUD Application",
            displayLogoff: false,
            displayWelcome: true,
            userName: "User"
        });

        layout.createRow(appHeader);

        var rPannel = new sap.ui.commons.Panel('rPannel', {
            text: "CRUD Collection List",
        });

        var oMainToolbar = new sap.m.Toolbar({
            content: [
                new sap.m.Input("inputPartnerId", {
                    width: "200px",
                    value: "0100000001",
                }),
                new sap.m.Button({
                    text: "Partner Details",
                    press: function () {
                        oController.PartnerDetails();
                    }
                }),

                new sap.m.Button({
                    text: "Update Product",
                    press: function () {
                        oController.UpdateSelectedProduct();
                    }
                }),
                new sap.m.Button({
                    text: "Update Product Dialog",
                    press: function () {
                        oController.UpdateProductDialog();
                    }
                }),
            ],
        });

        layout.createRow(oMainToolbar);

        // instantiate the table
        var oBusinessPartnerTable = new sap.ui.table.Table({
            id: "collectionTableID",
            title: "Business Partners",
            visibleRowCount: 1,
            editable: false,
            rowSelectionChange: function (oEvent) { },
        });

        oBusinessPartnerTable.setModel(oModel);

        var oMeta = oModel.getServiceMetadata();
        if (oMeta == undefined) {
            alert("metadata is not defined yet");
        }

        for (var i = 1; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
            var property = oMeta.dataServices.schema[0].entityType[0].property[i];

            oControl = new sap.ui.commons.TextField({ editable: false }).bindProperty("value", property.name);
            oBusinessPartnerTable.addColumn(new sap.ui.table.Column({
                label: new sap.ui.commons.Label({ text: property.name }),
                template: oControl, sortProperty: property.name, filterProperty: property.name,
                filterOperator: sap.ui.model.FilterOperator.EQ, flexible: true, width: "125px"
            }));
        }		   	  

        layout.createRow(oBusinessPartnerTable);

        // Add table to the Panel
        rPannel.addContent(oBusinessPartnerTable);

        var oPartnerProductsTable = new sap.ui.table.Table({
            id: "ProductsTableID",
            title: "Products",
            visibleRowCount: 6,
            editable: false,
            rowSelectionChange: function (oEvent) { },
        });

        oPartnerProductsTable.setModel(oModel);

        var oMeta = oModel.getServiceMetadata();
        if (oMeta == undefined) {
            alert("metadata is not defined yet");
        }

        for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
            var property = oMeta.dataServices.schema[0].entityType[1].property[i];

            oControl = new sap.ui.commons.TextField({ editable: (i==0 || i==2)?false:true }); //ID and category fields are not editable.
            oControl.bindProperty("value", property.name);
            oPartnerProductsTable.addColumn(new sap.ui.table.Column({
                label: new sap.ui.commons.Label({ text: property.name }),
                template: oControl,
                sortProperty: property.name,
                filterProperty: property.name,
                filterOperator: sap.ui.model.FilterOperator.EQ,
                flexible: true,
                width: "125px"
            }));


        }

        layout.createRow(oPartnerProductsTable);

        // Add table to the Panel
        rPannel.addContent(oPartnerProductsTable);

        // Add panel to the Layout
        layout.createRow(rPannel);
        // Display Layout
        this.addContent(layout);

        return layout;
    }
});