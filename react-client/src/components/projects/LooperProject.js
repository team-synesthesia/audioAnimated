import { Container } from "@mui/material";
import React, { useEffect } from "react";

import Sections from "./Sections";

const LooperProject = ({ project }) => {
  console.log("project", project);
  const { availableFiles, sections } = project;
  const projectFileCount = availableFiles.length;
  console.log("totalFiles: ", projectFileCount);
  return (
    <Container>
      <Sections sections={sections} projectFileCount={projectFileCount} />
    </Container>
  );
};

export default LooperProject;
