import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PermanentDrawerLeft from "./PermanentDrawerLeft";

import { Box } from "@mui/material";

import { fetchSingleProjectAsync, getFilesAsync } from "../../features/";
import LooperProject from "./LooperProject";

const SingleProject = () => {
  const { projectId } = useParams();
  const userId = useSelector((state) => state.auth.me.id);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProjectAsync({ projectId }));
  }, [dispatch, projectId]);

  const project = useSelector((state) => state.singleProject);
  const { availableFiles } = project;

  useEffect(() => {
    if (Object.keys(availableFiles).length) {
      dispatch(getFilesAsync({ projectId, availableFiles }));
    }
  }, [dispatch, projectId, availableFiles]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <PermanentDrawerLeft projectId={project.id} userId={userId} />
      {project.type === "looper" ? (
        <LooperProject
          project={project}
          userId={userId}
          projectId={projectId}
        />
      ) : (
        <h1>Single Project</h1>
      )}
    </Box>
  );
};

export default SingleProject;
