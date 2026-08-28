import StageManagementPage from "../components/StageManagementPage";

import useColoringStageEntriesStore from "../stores/ColoringStageEntriesStore";

import {
  coloringStageEntriesEntity,
  COLORING_STAGE_ID,
  COLORING_STAGE_NAME,
} from "../entities/ColoringStageEntriesEntity";

export default function ColoringManagementPage() {
  return (
    <StageManagementPage
      config={coloringStageEntriesEntity}
      storeHook={useColoringStageEntriesStore}
      stageId={COLORING_STAGE_ID}
      stageName={COLORING_STAGE_NAME}
      type="coloring"
    />
  );
}