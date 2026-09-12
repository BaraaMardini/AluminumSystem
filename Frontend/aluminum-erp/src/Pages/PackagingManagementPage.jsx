import StageManagementPage from "../components/StageManagementPage";

import usePackagingStageEntriesStore from "../stores/PackagingStageEntriesStore";

import {
  packagingStageEntriesEntity,
  PACKAGING_STAGE_ID,
  PACKAGING_STAGE_NAME,
} from "../entities/PackagingStageEntriesEntity";

export default function PackagingManagementPage() {
  return (
    <StageManagementPage
      config={packagingStageEntriesEntity}
      storeHook={usePackagingStageEntriesStore}
      stageId={PACKAGING_STAGE_ID}
      stageName={PACKAGING_STAGE_NAME}
      type="packaging"
    />
  );
}