import { createEntityStore } from "./createEntityStore";
import { productionOrdersEntity } from "../entities/ProductionOrdersEntity";

const useProductionOrdersStore = createEntityStore(productionOrdersEntity);
export default useProductionOrdersStore;