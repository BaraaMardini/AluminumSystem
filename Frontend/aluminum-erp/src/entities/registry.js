import { productionOrdersEntity } from "./ProductionOrdersEntity";
import { productionOrderStagesEntity } from "./ProductionOrderStagesEntity";
import { productionStageEntriesEntity } from "./ProductionStageEntriesEntity";
import { productionStagesEntity } from "./ProductionStagesEntity";
import { productsEntity } from "./ProductsEntity";
import { statusesEntity } from "./StatusesEntity";
import { wasteTypesEntity } from "./WasteTypesEntity";
import { wasteReasonsEntity } from "./WasteReasonsEntity";
import { productionStageWastesEntity } from "./ProductionStageWastesEntity";

// كل Entity جديد بينضاف هون تحت اسمه المنطقي (نفس الاسم يلي بيتحط بـ source.entity)
export const ENTITY_REGISTRY = {
  ProductionOrders: productionOrdersEntity,
  ProductionOrderStages: productionOrderStagesEntity,
  ProductionStageEntries: productionStageEntriesEntity,
  ProductionStages: productionStagesEntity,
  Products: productsEntity,
  Statuses: statusesEntity,
  WasteTypes: wasteTypesEntity,
  WasteReasons: wasteReasonsEntity,
  ProductionStageWastes: productionStageWastesEntity,
};