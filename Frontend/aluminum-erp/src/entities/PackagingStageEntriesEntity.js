export const PACKAGING_STAGE_ID = 3;
export const PACKAGING_STAGE_NAME = "التعبئة والتغليف";

export const packagingStageEntriesEntity = {
  entity: "ProductionStageEntriess",
  title: "التعبئة والتغليف",
  description: "تسجيل ومتابعة إدخالات مرحلة التعبئة والتغليف لكل طلبية إنتاج.",
  addLabel: "إضافة إدخال تعبئة",
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
          label: "طلبية التعبئة",
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