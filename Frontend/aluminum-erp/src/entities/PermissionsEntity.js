export const permissionsEntity = {
  entity: "Permissionss",

  operations: {
    // =========================================================
    // البحث
    // =========================================================

    search: {
      endpoint: "searchPermissions",

      filters: [
        {
          name: "ModuleName",
          label: "اسم الوحدة",
          type: "string",
        },
      ],

      columns: [
        { field: "id", header: "المعرّف" },
        { field: "code", header: "الكود" },
        { field: "name", header: "الاسم" },
        { field: "moduleName", header: "الوحدة" },
        { field: "actionName", header: "الإجراء" },
        { field: "isActive", header: "الحالة" },
      ],
    },

    // =========================================================
    // جلب الكل
    // =========================================================

    getAll: {
      endpoint: "all",

      columns: [
        { field: "id", header: "المعرّف" },
        { field: "code", header: "الكود" },
        { field: "name", header: "الاسم" },
        { field: "moduleName", header: "الوحدة" },
        { field: "actionName", header: "الإجراء" },
        { field: "isActive", header: "الحالة" },
      ],
    },

    // =========================================================
    // إضافة
    // =========================================================

    add: {
      endpoint: "",

      fields: [
        {
          name: "code",
          label: "الكود",
          type: "text",
        },

        {
          name: "name",
          label: "اسم الصلاحية",
          type: "text",
        },

        {
          name: "moduleName",
          label: "اسم الوحدة",
          type: "text",
        },

        {
          name: "actionName",
          label: "اسم الإجراء",
          type: "text",
        },

        {
          name: "bitIndex",
          label: "Bit Index",
          type: "number",
        },

        {
          name: "bitValue",
          label: "Bit Value",
          type: "text",
        },

        {
          name: "isActive",
          label: "مفعّلة",
          type: "checkbox",
        },
      ],
    },

    // =========================================================
    // تعديل
    // =========================================================

    update: {
      endpoint: "{value}",

      by: "id",

      fields: [
        {
          name: "name",
          label: "اسم الصلاحية",
          type: "text",
        },

        {
          name: "isActive",
          label: "مفعّلة",
          type: "checkbox",
        },
      ],
    },
  },
};