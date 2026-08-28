export const COLORING_STAGE_ID = 2;
export const COLORING_STAGE_NAME = "التلوين";

export const coloringStageEntriesEntity = {
  entity: "ProductionStageEntriess",
  title: "إدارة التلوين",
  description: "تسجيل ومتابعة إدخالات مرحلة التلوين لكل طلبية إنتاج.",
  addLabel: "إضافة إدخال تلوين",
  idField: "id",
  operations: {
    search: {
      endpoint: "searchProductionStageEntries",
      filters: [
        { name: "OrderID", label: "رقم الطلب", type: "number" },
        { name: "OrderStageID", label: "معرّف مرحلة الطلب", type: "number" },
      ],
      columns: [
        { field: "id", header: "المعرّف" },
        { field: "orderID", header: "رقم الطلب" },
        { field: "orderStageID", header: "معرّف مرحلة الطلب" },
        { field: "quantity", header: "الكمية" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
        { field: "notes", header: "ملاحظات" },
        { field: "userName", header: "المستخدم" },
      ],
    },
    add: {
      endpoint: "",
      fields: [
        {
          name: "orderStageID",
          label: "طلبية التلوين",
          type: "select",
          source: {
            entity: "ProductionOrderStages",
            operation: "search",
            valueField: "id",
            displayField: "id",
          },
        },
        { name: "quantity", label: "الكمية", type: "number" },
        { name: "email", label: "البريد الإلكتروني", type: "text", autoFrom: "currentUser.email" },
        { name: "notes", label: "ملاحظات", type: "textarea" },
      ],
    },
    update: {
      endpoint: "{value}",
      by: "id",
      fields: [{ name: "notes", label: "ملاحظات", type: "textarea" }],
    },
    delete: { endpoint: "{value}", by: "id" },
  },
};