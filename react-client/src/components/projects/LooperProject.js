import { Container } from "@mui/material";
import React, { useEffect } from "react";

import Sections from "./Sections";

const LooperProject = ({ project }) => {
  const { availableFiles, sections } = project;
  const projectFileCount = availableFiles.length;
  const sectionDuration = 30;
  return (
    <Container>
      <Sections
        sections={sections}
        sectionDuration={sectionDuration}
        projectFileCount={projectFileCount}
      />
    </Container>
  );
};

export default LooperProject;
