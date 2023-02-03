import * as React from "react";
import { Box } from "@mui/material";

import SectionColumn from "./SectionColumn";
import AddNewSection from "./AddNewSection";

import { GPU } from "./GPU/GPU";

export default function Sections({ sections, userId, projectId }) {
  const sectionAnimationRef = React.useRef();
  const [GPUconfig, setGPUconfig] = React.useState({});
  const [canvasInitialized, setCanvasInitialized] = React.useState(false);
  GPU({
    GPUconfig,
    gpuDivRef: sectionAnimationRef.current,
    canvasInitialized,
    setCanvasInitialized,
  });

  return (
    <Box
      sx={{
        marginLeft: "270px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {sections && sections.length
        ? sections.map((section) => (
            <div key={section.id}>
              <SectionColumn
                section={section}
                userId={userId}
                projectId={projectId}
                files={section.files}
                sectionNumber={section.sectionNumber}
                sectionId={section.id}
                sectionAnimationRef={sectionAnimationRef.current}
                setGPUconfig={setGPUconfig}
                setCanvasInitialized={setCanvasInitialized}
              />
            </div>
          ))
        : null}
      <div
        id="sectionAnimation"
        className="hidden"
        ref={sectionAnimationRef}
        style={{
          marginTop: "36px",
          marginRight: "4vw",
          flexShrink: "0",
          width: 640,
          height: 480,
        }}
      ></div>
      <AddNewSection projectId={projectId} />
    </Box>
  );
}
