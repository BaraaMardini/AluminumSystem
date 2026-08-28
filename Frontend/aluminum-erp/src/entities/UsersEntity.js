export const usersEntity = {
  entity: "userss", // يطابق [Route("api/userss")]
  title: "المستخدمون",
  description:
    "إدارة حسابات مستخدمي النظام، أدوارهم، وصلاحياتهم التفصيلية.",
  addLabel: "إضافة مستخدم",
  idField: "id",

  operations: {
    search: {
      endpoint: "searchUsers",

      filters: [
        {
          name: "ID",
          label: "المعرّف",
          type: "int",
        },
        {
          name: "UserName",
          label: "اسم المستخدم",
          type: "string",
        },
        {
          name: "IsActive",
          label: "الحالة",
          type: "select",
          options: [
            {
              value: "true",
              label: "نشط",
            },
            {
              value: "false",
              label: "غير نشط",
            },
          ],
        },
      ],

      columns: [
        {
          field: "id",
          header: "المعرّف",
        },
        {
          field: "userName",
          header: "اسم المستخدم",
        },
        {
          field: "fullName",
          header: "الاسم الكامل",
        },
        {
          field: "email",
          header: "البريد الإلكتروني",
        },
        {
          field: "roleName",
          header: "الدور",
        },
        {
          field: "createdAt",
          header: "تاريخ الإنشاء",
        },
        {
          field: "isActive",
          header: "الحالة",
        },
      ],
    },

    getAll: {
      endpoint: "all",

      columns: [
        {
          field: "id",
          header: "المعرّف",
        },
        {
          field: "userName",
          header: "اسم المستخدم",
        },
        {
          field: "fullName",
          header: "الاسم الكامل",
        },
        {
          field: "email",
          header: "البريد الإلكتروني",
        },
        {
          field: "roleName",
          header: "الدور",
        },
        {
          field: "createdAt",
          header: "تاريخ الإنشاء",
        },
        {
          field: "isActive",
          header: "الحالة",
        },
      ],
    },

    add: {
      endpoint: "",

      fields: [
        {
          name: "userName",
          label: "اسم المستخدم",
          type: "text",
          required: true,
        },

        {
          name: "password",
          label: "كلمة السر",
          type: "password",
          required: true,
        },

        {
          name: "fullName",
          label: "الاسم الكامل",
          type: "text",
          required: true,
        },

        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          required: true,
        },

        {
          name: "roleID",
          label: "الدور",
          type: "select",
          required: true,

          source: {
            entity: "Roles",
            operation: "getAll",
            valueField: "id",
            displayField: "roleName",
          },
        },

        {
          name: "permissions",
          label: "الصلاحيات",
          type: "select",
          multiple: true,

          source: {
            entity: "Permissions",
            operation: "getAll",
            valueField: "id",
            displayField: "name",
            groupBy: "moduleName",
          },
        },
      ],
    },
  },
};