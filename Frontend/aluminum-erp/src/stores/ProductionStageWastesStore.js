import { createEntityStore } from "./createEntityStore";
import { productionStageWastesEntity } from "../entities/ProductionStageWastesEntity";

const useProductionStageWastesStore = createEntityStore(productionStageWastesEntity);
export default useProductionStageWastesStore;