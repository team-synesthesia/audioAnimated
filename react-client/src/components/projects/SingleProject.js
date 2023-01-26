import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";

import { fetchSingleProjectAsync } from "../../features/";
import LooperProject from "./LooperProject";

const SingleProject = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSingleProjectAsync({ projectId }));
    };
    fetchData();
  }, [dispatch, projectId]);

  const project = useSelector((state) => state.singleProject);
  return (
    <Container>
      {project.type === "looper" ? (
        <LooperProject project={project} />
      ) : (
        <h1>Single Project</h1>
      )}
    </Container>
  );
};

export default SingleProject;
