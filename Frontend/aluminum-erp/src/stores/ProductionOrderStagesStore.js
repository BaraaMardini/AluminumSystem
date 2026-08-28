import { createEntityStore } from "./createEntityStore";
import { productionOrderStagesEntity } from "../entities/ProductionOrderStagesEntity";

const useProductionOrderStagesStore = createEntityStore(productionOrderStagesEntity);
export default useProductionOrderStagesStore;