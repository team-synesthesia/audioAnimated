import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";

import { fetchSingleProjectAsync, getFilesAsync } from "../../features/";
import LooperProject from "./LooperProject";
import AudioContextPlus from "../../audio";

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
  const { availableFiles, audioRawFiles } = project;

  useEffect(() => {
    const fetchData = async () => {
      if (availableFiles.length) {
        const filenames = availableFiles.map((x) => x.filePath);
        await dispatch(getFilesAsync({ filenames }));
      }
    };
    fetchData();
  }, [dispatch, availableFiles]);

  useEffect(() => {
    const acPlus = new AudioContextPlus();
    audioRawFiles.forEach((raw, i) => {
      acPlus.convertRawToSomething(raw, i + 1);
    });
  }, [availableFiles, audioRawFiles]);

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
