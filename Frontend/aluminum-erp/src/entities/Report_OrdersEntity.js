export const report_OrdersEntity = {
  entity: "report_orderss",

  operations: {
    search: {
      endpoint: "SearchReport_Orders",

      filters: [
        {
          name: "OrderID",
          label: "رقم الطلبية",
          type: "select",
          source: {
            entity: "ProductionOrders",
            operation: "getAll",
            valueField: "id",
            displayField: "id",
          },
        },
        {
          name: "ProductName",
          label: "اسم المنتج",
          type: "select",
          source: {
            entity: "Products",
            operation: "getAll",
            valueField: "productName",
            displayField: "productName",
          },
        },
        {
          name: "StatusName",
          label: "حالة الطلبية",
          type: "select",
          source: {
            entity: "Statuses",
            operation: "getAll",
            valueField: "statusName",
            displayField: "statusName",
          },
        },
        {
          name: "FromDate",
          label: "من تاريخ",
          type: "date",
        },
        {
          name: "ToDate",
          label: "إلى تاريخ",
          type: "date",
        },
      ],

      columns: [
        { field: "orderID", header: "رقم الطلبية" },
        { field: "productName", header: "اسم المنتج" },
        { field: "requestedQuantity", header: "الكمية المطلوبة" },

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

        {
          field: "productionCompletionPercentage",
          header: "نسبة إنجاز الإنتاج",
        },
        {
          field: "wastePercentage",
          header: "نسبة الهدر",
        },

        { field: "statusName", header: "حالة الطلبية" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
      ],
    },
  },
};