import { createEntityStore } from "./createEntityStore";
import { report_ProductProductionEntity } from "../entities/Report_ProductProductionEntity";

const useReportProductProductionStore = createEntityStore(report_ProductProductionEntity);
export default useReportProductProductionStore;