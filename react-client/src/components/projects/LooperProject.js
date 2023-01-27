import { Container } from "@mui/material";
import React, { useEffect } from "react";

import Sections from "./Sections";

const LooperProject = ({ project, acPlusRef }) => {
  const { availableFiles, sections } = project;
  const projectFileCount = availableFiles.length;
  const sectionDuration = 30;
  return (
    <Container>
      <Sections
        sections={sections}
        acPlusRef={acPlusRef}
        sectionDuration={sectionDuration}
        projectFileCount={projectFileCount}
      />
    </Container>
  );
};

export default LooperProject;
