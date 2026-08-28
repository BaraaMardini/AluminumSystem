export const report_ProductProductionEntity = {
    entity: "report_product_production",

    operations: {
        search: {
            endpoint: "SearchReport_ProductProduction",

            filters: [
                {
                    name: "ProductID",
                    label: "معرّف المنتج",
                    type: "select",
                    source: {
                        entity: "Products",
                        operation: "getAll",
                        valueField: "id",
                        displayField: "productName",
                    },
                },
                { name: "FromDate", label: "من تاريخ", type: "date" },
                { name: "ToDate", label: "إلى تاريخ", type: "date" },
            ],

            columns: [
                { field: "productID", header: "معرّف المنتج" },
                { field: "productName", header: "اسم المنتج" },
                { field: "totalRequestedQuantity", header: "إجمالي الكمية المطلوبة" },
                { field: "cuttingQuantity", header: "كمية القص" },
                { field: "cuttingWaste", header: "هدر القص" },
                { field: "cuttingGoodQuantity", header: "الصافي بعد القص" },
                { field: "paintingQuantity", header: "كمية التلوين" },
                { field: "paintingWaste", header: "هدر التلوين" },
                { field: "paintingGoodQuantity", header: "الصافي بعد التلوين" },
                { field: "packagingQuantity", header: "كمية التعبئة" },
                { field: "packagingWaste", header: "هدر التعبئة" },
                { field: "finalProducedQuantity", header: "الإنتاج النهائي" },
                { field: "totalWasteQuantity", header: "إجمالي الهدر" },
                { field: "remainingQuantity", header: "الكمية المتبقية" },
                { field: "productionCompletionPercentage", header: "نسبة إنجاز الإنتاج" },
                { field: "wastePercentage", header: "نسبة الهدر" },
            ],
        },
    },
};