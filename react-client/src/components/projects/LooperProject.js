import React from "react";

import Sections from "./Sections";

const LooperProject = ({ project, userId, projectId }) => {
  const { sections, sectionDuration } = project;
  return (
    <Sections
      sections={sections}
      sectionDuration={sectionDuration}
      userId={userId}
      projectId={projectId}
    />
  );
};

export default LooperProject;
