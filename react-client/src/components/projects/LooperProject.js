import React from "react";

import Sections from "./Sections";

const LooperProject = ({ project, userId, projectId }) => {
  const { sections } = project;
  return <Sections sections={sections} userId={userId} projectId={projectId} />;
};

export default LooperProject;
