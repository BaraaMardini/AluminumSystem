export const wasteTypesEntity = {
  entity: "WasteTypess",
  title: "أنواع التالف",
  description: "إدارة أنواع التالف المستخدمة بتقارير الإنتاج",
  addLabel: "إضافة نوع تالف جديد",
  idField: "id",
  operations: {
    getAll: {
      endpoint: "all",
      columns: [
        { field: "id", header: "المعرف" },
        { field: "nameAr", header: "الاسم" },
        { field: "isActive", header: "الحالة" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
      ],
    },
    add: {
      endpoint: "",
      fields: [
        {
          name: "nameAr",
          label: "الاسم",
          type: "text",
        },
      ],
    },
    update: {
      endpoint: "{value}",
      by: "id",
      fields: [
        {
          name: "isActive",
          label: "نشط",
          type: "checkbox",
        },
      ],
    },
  },
};