import { createEntityStore } from "./createEntityStore";
import { coloringStageEntriesEntity } from "../entities/ColoringStageEntriesEntity";

const useColoringStageEntriesStore = createEntityStore(coloringStageEntriesEntity);
export default useColoringStageEntriesStore;