import StageManagementPage from "../components/StageManagementPage";

import useCuttingStageEntriesStore from "../stores/CuttingStageEntriesStore";

import {
  cuttingStageEntriesEntity,
  CUTTING_STAGE_ID,
  CUTTING_STAGE_NAME,
} from "../entities/CuttingStageEntriesEntity";

export default function CuttingManagementPage() {
  return (
    <StageManagementPage
      config={cuttingStageEntriesEntity}
      storeHook={useCuttingStageEntriesStore}
      stageId={CUTTING_STAGE_ID}
      stageName={CUTTING_STAGE_NAME}
      type="cutting"
    />
  );
}