export const productionStageEntriesEntity = {
    entity: "ProductionStageEntriess",
    operations: {
        search: {
            endpoint: "searchProductionStageEntries",
            filters: [
                { name: "OrderID", label: "رقم الطلب", type: "number" },
                { name: "OrderStageID", label: "معرّف مرحلة الطلب", type: "number" },
                { name: "StageID", label: "معرّف المرحلة", type: "number" },
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
        getAll: {
            endpoint: "all",
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
                { name: "orderStageID", label: "معرّف مرحلة الطلب",      type: "select",
                    source: {
                        entity: "ProductionOrderStages",
                        operation: "search",
                        valueField: "id",
                        displayField: "id",
                        where: "StageName=القص او التلوين او التعبئة والتغليف"
                    
                    } },
                { name: "quantity", label: "الكمية", type: "number" },
                { name: "email", label: "البريد الإلكتروني", type: "text", autoFrom: "currentUser.email" },
                { name: "notes", label: "ملاحظات", type: "text" },
            ]
        },
        update: {
            endpoint: "{value}",
            by: "id",
            fields: [
                { name: "notes", label: "ملاحظات", type: "text" },
            ]
        },
        delete: { endpoint: "{value}", by: "id" },
    },
};