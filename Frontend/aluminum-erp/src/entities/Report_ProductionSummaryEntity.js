export const report_ProductionSummaryEntity = {
    entity: "report_production_summary",

    operations: {
        search: {
            endpoint: "SearchReport_ProductionSummary",

            filters: [
                { name: "FromDate", label: "من تاريخ", type: "date" },
                { name: "ToDate", label: "إلى تاريخ", type: "date" },
            ],

            columns: [
                { field: "ordersCount", header: "عدد الطلبيات" },
                { field: "totalRequestedQuantity", header: "إجمالي الكمية المطلوبة" },
                { field: "totalProducedQuantity", header: "إجمالي الإنتاج" },
                { field: "remainingQuantity", header: "الكمية المتبقية" },
                { field: "totalWasteQuantity", header: "إجمالي الهدر" },
                { field: "productionCompletionPercentage", header: "نسبة إنجاز الإنتاج" },
                { field: "wastePercentage", header: "نسبة الهدر" },
                { field: "completedOrdersCount", header: "الطلبيات المكتملة" },
                { field: "incompleteOrdersCount", header: "الطلبيات غير المكتملة" },
            ],
        },
    },
};