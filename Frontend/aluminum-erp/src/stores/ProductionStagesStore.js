import { createEntityStore } from "./createEntityStore";
import { productionStagesEntity } from "../entities/ProductionStagesEntity";

const useProductionStagesStore = createEntityStore(productionStagesEntity);
export default useProductionStagesStore;