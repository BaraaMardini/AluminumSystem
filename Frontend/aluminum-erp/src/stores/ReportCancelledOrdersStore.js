import { createEntityStore } from "./createEntityStore";
import { report_CancelledOrdersEntity } from "../entities/Report_CancelledOrdersEntity";

const useReportCancelledOrdersStore = createEntityStore(
  report_CancelledOrdersEntity
);

export default useReportCancelledOrdersStore;