export const productionStagesEntity = {
  entity: "ProductionStagess",
  operations: {
    getAll: {
      endpoint: "all",
      columns: [
        { field: "id", header: "المعرّف" },
        { field: "stageName", header: "اسم المرحلة" },
        { field: "description", header: "الوصف" },
        { field: "displayOrder", header: "ترتيب العرض" },
        { field: "createdAt", header: "تاريخ الإنشاء" },
        { field: "isActive", header: "مفعّلة" },
      ],
    },
    add: {
      endpoint: "",
      fields: [
        { name: "stageName", label: "اسم المرحلة", type: "text" },
        { name: "description", label: "الوصف", type: "text" },
        { name: "displayOrder", label: "ترتيب العرض", type: "number" },
        { name: "isActive", label: "مفعّلة", type: "checkbox" },
      ],
    },
    update: {
      endpoint: "{value}",
      by: "id",
      fields: [{ name: "isActive", label: "مفعّلة", type: "checkbox" }],
    },
  },
};