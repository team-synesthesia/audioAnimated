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
                userId={userId}
                projectId={projectId}
                files={section.files}
                sectionDuration={sectionDuration}
                sectionNumber={section.sectionNumber}
                sectionId={section.id}
              />
              <div
                id={section.sectionNumber}
                className="hidden sectionAnimation"
              >
                {/* replace this with sectionAnimation, probably best in its own React component */}
                <img
                  height={400}
                  width={600}
                  src="https://th-thumbnailer.cdn-si-edu.com/V408Xd8N2y92XNQ05rRH4nu1LR0=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/df/a9/dfa966b8-9bb4-426e-ade1-98c2a982b59f/6754298445_3918332c9e_o.jpg"
                  alt="kangaroos"
                />
              </div>
            </div>
          ))
        : null}
      <AddNewSection projectId={projectId} />
    </Box>
  );
}
