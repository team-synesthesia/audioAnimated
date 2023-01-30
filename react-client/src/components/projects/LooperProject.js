import { Container } from "@mui/material";
import React from "react";

import Sections from "./Sections";

const LooperProject = ({ project, userId, projectId }) => {
  const { sections, sectionDuration } = project;
  return (
    <Container>
      <Sections
        sections={sections}
        sectionDuration={sectionDuration}
        userId={userId}
        projectId={projectId}
      />
    </Container>
  );
};

export default LooperProject;
