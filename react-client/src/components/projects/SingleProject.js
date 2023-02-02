import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PermanentDrawerLeft from "./PermanentDrawerLeft";

import { fetchSingleProjectAsync, getFilesAsync } from "../../features/";
import LooperProject from "./LooperProject";

const SingleProject = () => {
  const { projectId } = useParams();
  const userId = useSelector((state) => state.auth.me.id);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSingleProjectAsync({ projectId }));
    };
    fetchData();
  }, [dispatch, projectId]);

  const project = useSelector((state) => state.singleProject);
  const { availableFiles } = project;

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(availableFiles).length) {
        await dispatch(getFilesAsync({ projectId, availableFiles }));
      }
    };
    fetchData();
  }, [dispatch, projectId, availableFiles]);

  return (
    <div>
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
    </div>
  );
};

export default SingleProject;
