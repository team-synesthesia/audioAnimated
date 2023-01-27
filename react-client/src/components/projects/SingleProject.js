import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";

import { fetchSingleProjectAsync, getFilesAsync } from "../../features/";
import LooperProject from "./LooperProject";
import AudioContextPlus from "../../audio";

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

  const acPlusRef = useRef(new AudioContextPlus());
  useEffect(() => {
    audioRawFiles.forEach((raw, i) => {
      // const fileId = availableFiles[i].id;
      const fileId = Number(availableFiles[i].id);
      const audioId = `user_${userId}_project_${projectId}_file_${fileId}`;
      let audio = document.getElementById(audioId);
      if (!audio) {
        audio = document.createElement("audio");
        audio.setAttribute("id", audioId);
      }
      acPlusRef.current.createAudioBuffers(raw, audio, fileId);
    });
  }, [projectId, userId, availableFiles, audioRawFiles]);

  return (
    <Container>
      {project.type === "looper" ? (
        <LooperProject project={project} acPlusRef={acPlusRef} />
      ) : (
        <h1>Single Project</h1>
      )}
    </Container>
  );
};

export default SingleProject;
