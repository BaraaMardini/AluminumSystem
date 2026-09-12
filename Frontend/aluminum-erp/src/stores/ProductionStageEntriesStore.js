import { createEntityStore } from "./createEntityStore";
import { productionStageEntriesEntity } from "../entities/ProductionStageEntriesEntity";

const useProductionStageEntriesStore = createEntityStore(productionStageEntriesEntity);
export default useProductionStageEntriesStore;