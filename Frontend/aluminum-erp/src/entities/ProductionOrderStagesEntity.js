export const productionOrderStagesEntity = {
    entity: "ProductionOrderStagess",

    operations: {
        search: {
            endpoint: "searchProductionOrderStages",

            filters: [
                {
                    name: "OrderID",
                    label: "رقم الطلب",
                    type: "select",
                    source: {
                        entity: "ProductionOrders",
                        operation: "getAll",
                        valueField: "id",
                        displayField: "id",
                    },
                },

                {
                    name: "StageName",
                    label: "المرحلة",
                    type: "select",
                    source: {
                        entity: "ProductionStages",
                        operation: "getAll",
                        valueField: "stageName",
                        displayField: "stageName",
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
                { field: "orderID", header: "رقم الطلب" },
                { field: "stageName", header: "المرحلة" },
                { field: "statusName", header: "الحالة" },
                { field: "createdAt", header: "تاريخ الإنشاء" },
            ],
        },

        getAll: {
            endpoint: "all",

            columns: [
                { field: "id", header: "المعرّف" },
                { field: "orderID", header: "رقم الطلب" },
                { field: "stageName", header: "المرحلة" },
                { field: "statusName", header: "الحالة" },
                { field: "createdAt", header: "تاريخ الإنشاء" },
            ],
        },

        add: {
            endpoint: "",

            fields: [
                {
                    name: "orderID",
                    label: "رقم الطلب",
                    type: "number",
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
    },
};