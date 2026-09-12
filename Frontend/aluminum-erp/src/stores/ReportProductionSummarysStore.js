import { createEntityStore } from "./createEntityStore";
import { report_ProductionSummaryEntity } from "../entities/Report_ProductionSummaryEntity";

const useReportProductionSummaryStore = createEntityStore(report_ProductionSummaryEntity);
export default useReportProductionSummaryStore;