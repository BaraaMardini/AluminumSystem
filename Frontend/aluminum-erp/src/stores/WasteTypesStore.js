import { createEntityStore } from "./createEntityStore";
import { wasteTypesEntity } from "../entities/WasteTypesEntity";

const useWasteTypesStore = createEntityStore(wasteTypesEntity);
export default useWasteTypesStore;