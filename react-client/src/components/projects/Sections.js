import * as React from "react";
import { Box } from "@mui/material";

import SectionColumn from "./SectionColumn";
import AddNewSection from "./AddNewSection";

export default function Sections({
  sections,
  sectionDuration,
  userId,
  projectId,
}) {

  const sectionAnimationRef = React.useRef()

  return (
    <Box
      sx={{
        marginLeft: "270px",
        display: "flex",
        flexDirection: "row"
      }}
    >
      {sections && sections.length
        ? sections.map((section) => (
            <div key={section.id}>
              <SectionColumn
                userId={userId}
                projectId={projectId}
                files={section.files}
                sectionDuration={sectionDuration}
                sectionNumber={section.sectionNumber}
                sectionId={section.id}
                sectionAnimationRef={sectionAnimationRef}
              />

            </div>
          )
        )
        : null}
      <div id="sectionAnimation" className="hidden" ref={sectionAnimationRef}
        style={{marginTop:"36px",marginRight:"4vw",flexShrink:"0",width:640,height:480,backgroundColor:"blue"}}></div>
      <AddNewSection projectId={projectId} />
    </Box>
  );
}
