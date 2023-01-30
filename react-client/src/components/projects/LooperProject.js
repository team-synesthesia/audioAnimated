import { Container } from "@mui/material";
import React, { useEffect } from "react";

import Sections from "./Sections";

const LooperProject = ({ project, userId, projectId }) => {
  const { sections } = project;
  const sectionDuration = 30;
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
