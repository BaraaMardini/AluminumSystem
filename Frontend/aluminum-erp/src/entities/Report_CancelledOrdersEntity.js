export const report_CancelledOrdersEntity = {
  entity: "report_cancelled_orders",

  operations: {
    search: {
      endpoint: "SearchReport_CancelledOrders",

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
        // =====================================================
        // معلومات الطلبية
        // =====================================================

        {
          field: "orderID",
          header: "رقم الطلبية",
        },

        {
          field: "productName",
          header: "اسم المنتج",
        },

        {
          field: "requestedQuantity",
          header: "الكمية المطلوبة",
        },

        // =====================================================
        // القص
        // =====================================================

        {
          field: "cuttingQuantity",
          header: "كمية القص",
        },

        {
          field: "cuttingWaste",
          header: "هدر القص",
        },

        {
          field: "cuttingGoodQuantity",
          header: "الصافي بعد القص",
        },

        // =====================================================
        // التلوين
        // =====================================================

        {
          field: "paintingQuantity",
          header: "كمية التلوين",
        },

        {
          field: "paintingWaste",
          header: "هدر التلوين",
        },

        {
          field: "paintingGoodQuantity",
          header: "الصافي بعد التلوين",
        },

        // =====================================================
        // التعبئة والتغليف
        // =====================================================

        {
          field: "packagingQuantity",
          header: "كمية التعبئة",
        },

        {
          field: "packagingWaste",
          header: "هدر التعبئة",
        },

        {
          field: "finalProducedQuantity",
          header: "الإنتاج النهائي",
        },

        // =====================================================
        // إجمالي الإنتاج عبر المراحل
        // =====================================================

        {
          field: "totalProducedAcrossStages",
          header: "إجمالي الإنتاج عبر المراحل",
        },

        // =====================================================
        // الهدر
        // =====================================================

        {
          field: "totalWasteQuantity",
          header: "إجمالي الهدر",
        },

        {
          field: "wastePercentage",
          header: "نسبة الهدر",
        },

        // =====================================================
        // الحالة والتاريخ
        // =====================================================

        {
          field: "statusName",
          header: "حالة الطلبية",
        },

        {
          field: "createdAt",
          header: "تاريخ الإنشاء",
        },
      ],
    },
  },
};

