import { createEntityStore } from "./createEntityStore";
import { rolesEntity } from "../entities/RolesEntity";

const useRolesStore = createEntityStore(rolesEntity);
export default useRolesStore;