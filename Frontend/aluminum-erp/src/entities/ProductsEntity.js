export const productsEntity = {
    entity: "Productss",
    operations: {

        getAll: {
            endpoint: "all",
            columns: [
                { field: "id", header: "المعرّف" },
                { field: "productName", header: "اسم المنتج" },
                { field: "description", header: "الوصف" },
                { field: "isActive", header: "الحالة" },
                { field: "createdAt", header: "تاريخ الإنشاء" },
                { field: "updatedAt", header: "تاريخ التعديل" },
            ],
        },
        add: {
            endpoint: "",
            fields: [
                {
                    name: "productName",
                    label: "اسم المنتج",
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
                    label: "الحالة",
                    type: "checkbox"
                },
            ]
        },

    },
};