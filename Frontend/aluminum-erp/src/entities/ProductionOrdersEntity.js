export const productionOrdersEntity = {
  entity: "ProductionOrderss",
  title: "طلبيات الإنتاج",
  description: "إدارة طلبيات الإنتاج ومتابعة حالتها عبر مراحل التصنيع.",
  addLabel: "إضافة طلبية",
  idField: "id",
  operations: {
    search: {
      endpoint: "searchProductionOrders",
      filters: [
        {
          name: "ProductName",
          label: "المنتج",
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
          label: "الحالة",
          type: "select",
          source: {
            entity: "Statuses",
            operation: "getAll",
            valueField: "statusName",
            displayField: "statusName",
          },
        },
      ],
      columns: [
        { field: "id", header: "المعرّف" },
        { field: "productName", header: "المنتج" },
        { field: "requestedQuantity", header: "الكمية المطلوبة" },
        { field: "statusName", header: "الحالة" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
        { field: "updatedAt", header: "تاريخ التحديث" },
        { field: "notes", header: "ملاحظات" },
        { field: "createdBy", header: "أنشئت بواسطة" },
      ],
    },
    getAll: {
      endpoint: "all",
      columns: [
        { field: "id", header: "المعرّف" },
        { field: "productName", header: "المنتج" },
        { field: "requestedQuantity", header: "الكمية المطلوبة" },
        { field: "statusName", header: "الحالة" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
        { field: "updatedAt", header: "تاريخ التحديث" },
        { field: "notes", header: "ملاحظات" },
        { field: "createdBy", header: "أنشئت بواسطة" },
      ],
    },
    add: {
      endpoint: "",
      fields: [
        {
          name: "productID",
          label: "المنتج",
          type: "select",
          source: {
            entity: "Products",
            operation: "getAll",
            valueField: "id",
            displayField: "productName",
          },
        },
        {
          name: "requestedQuantity",
          label: "الكمية المطلوبة",
          type: "number",
        },
        {
          name: "statusID",
          label: "الحالة",
          type: "select",
          source: {
            entity: "Statuses",
            operation: "getAll",
            valueField: "id",
            displayField: "statusName",
          },
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "text",
          autoFrom: "currentUser.email",
        },
        {
          name: "notes",
          label: "ملاحظات",
          type: "text",
        },
      ],
    },
    update: {
      endpoint: "{value}",
      by: "id",
      fields: [
        {
          name: "statusID",
          label: "الحالة",
          type: "select",
          source: {
            entity: "Statuses",
            operation: "getAll",
            valueField: "id",
            displayField: "statusName",
          },
        },
      ],
    },
    delete: {
      endpoint: "{value}",
      by: "id",
    },
  },
};