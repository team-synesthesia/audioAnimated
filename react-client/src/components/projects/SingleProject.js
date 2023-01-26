import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
  selectSingleProject,
  fetchSingleProjectAsync,
} from "../../features/projects/SingleProjectSlice";

const SingleProject = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSingleProjectAsync({ projectId }));
    };
    fetchData();
  }, [dispatch, projectId]);

  const project = useSelector(selectSingleProject);
  return <h1>Single Project</h1>;
};

export default SingleProject;
