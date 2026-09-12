import { createEntityStore } from "./createEntityStore";

import {
  report_ProductComparisonEntity,
} from "../entities/Report_ProductComparisonEntity";


const useReportProductComparisonStore =
  createEntityStore(
    report_ProductComparisonEntity
  );


export default useReportProductComparisonStore;