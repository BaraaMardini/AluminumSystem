import { createEntityStore } from "./createEntityStore";
import { cuttingStageEntriesEntity } from "../entities/CuttingStageEntriesEntity";

const useCuttingStageEntriesStore = createEntityStore(cuttingStageEntriesEntity);
export default useCuttingStageEntriesStore;