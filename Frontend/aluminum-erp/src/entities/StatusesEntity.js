export const statusesEntity = {
    entity: "Statusess",
    operations: {
        getAll: {
            endpoint: "all",
            columns: [
                { field: "id", header: "المعرّف" },
                { field: "statusName", header: "اسم الحالة" },
                { field: "description", header: "الوصف" },
                { field: "createdAt", header: "تاريخ الإنشاء" },
                { field: "updatedAt", header: "تاريخ التعديل" },
                { field: "isActive", header: "مفعّلة" },
            ],
        },
        add: {
            endpoint: "",
            fields: [
                {
                    name: "statusName",
                    label: "اسم الحالة",
                    type: "text"
                },
                {
                    name: "description",
                    label: "الوصف",
                    type: "text"
                },
            ]
        },
        update: {
            endpoint: "{value}",
            by: "id",
            fields: [
                {
                    name: "description",
                    label: "الوصف",
                    type: "text"
                },
                {
                    name: "isActive",
                    label: "مفعّلة",
                    type: "checkbox"
                },
            ]
        },
    },
};