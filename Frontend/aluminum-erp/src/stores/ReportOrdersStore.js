import { createEntityStore } from "./createEntityStore";
import { report_OrdersEntity } from "../entities/Report_OrdersEntity";

const useReportOrdersStore = createEntityStore(report_OrdersEntity);
export default useReportOrdersStore;