import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchSingleProjectAsync } from "../../features/";

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
  return <h1>Single Project</h1>;
};

export default SingleProject;
