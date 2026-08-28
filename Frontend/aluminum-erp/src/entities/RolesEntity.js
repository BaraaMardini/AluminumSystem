export const rolesEntity = {
  entity: "Roless",
  title: "الأدوار والصلاحيات",
  description: "إدارة أدوار المستخدمين وصلاحياتهم بالنظام",
  addLabel: "إضافة دور جديد",
  idField: "id",
  operations: {
    getAll: {
      endpoint: "all",
      columns: [
        { field: "id", header: "المعرف" },
        { field: "roleName", header: "اسم الدور" },
        { field: "description", header: "الوصف" },
        { field: "isActive", header: "الحالة" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
        { field: "updatedAt", header: "تاريخ التحديث" },
      ],
    },
    add: {
      endpoint: "",
      fields: [
        {
          name: "roleName",
          label: "اسم الدور",
          type: "text",
        },
        {
          name: "description",
          label: "الوصف",
          type: "text",
        },
        {
          name: "isActive",
          label: "نشط",
          type: "checkbox",
        },
      ],
    },
    update: {
      endpoint: "{value}",
      by: "id",
      fields: [
        {
          name: "description",
          label: "الوصف",
          type: "text",
        },
        {
          name: "isActive",
          label: "نشط",
          type: "checkbox",
        },
      ],
    },
  },
};