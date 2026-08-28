import { createEntityStore } from "./createEntityStore";
import { statusesEntity } from "../entities/StatusesEntity";

const useStatusesStore = createEntityStore(statusesEntity);
export default useStatusesStore;