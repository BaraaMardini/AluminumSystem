import { createEntityStore } from "./createEntityStore";
import { wasteReasonsEntity } from "../entities/WasteReasonsEntity";

const useWasteReasonsStore = createEntityStore(wasteReasonsEntity);
export default useWasteReasonsStore;