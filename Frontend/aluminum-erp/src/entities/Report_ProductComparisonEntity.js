export const report_ProductComparisonEntity = {
    entity: "report_product_comparison",

    operations: {
        search: {
            endpoint: "SearchReport_ProductComparison",

            filters: [
                { name: "FromDate", label: "من تاريخ", type: "date" },
                { name: "ToDate", label: "إلى تاريخ", type: "date" },
            ],

            columns: [
                { field: "productID", header: "معرّف المنتج" },
                { field: "productName", header: "اسم المنتج" },
                { field: "totalRequestedQuantity", header: "إجمالي الكمية المطلوبة" },
                { field: "totalProducedQuantity", header: "إجمالي الإنتاج" },
                { field: "totalWasteQuantity", header: "إجمالي الهدر" },
                { field: "remainingQuantity", header: "الكمية المتبقية" },
                { field: "productionCompletionPercentage", header: "نسبة إنجاز الإنتاج" },
                { field: "wastePercentage", header: "نسبة الهدر" },
            ],
        },
    },
};