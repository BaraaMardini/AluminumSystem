import { createEntityStore } from "./createEntityStore";
import { packagingStageEntriesEntity } from "../entities/PackagingStageEntriesEntity";

const usePackagingStageEntriesStore = createEntityStore(packagingStageEntriesEntity);
export default usePackagingStageEntriesStore;