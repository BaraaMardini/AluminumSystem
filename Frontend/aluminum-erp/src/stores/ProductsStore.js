import { createEntityStore } from "./createEntityStore";
import { productsEntity } from "../entities/ProductsEntity";

const useProductsStore = createEntityStore(productsEntity);
export default useProductsStore;