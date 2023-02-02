import * as React from "react";
import { Box, Grid, Button } from "@mui/material";

import AudioContextPlus from "../../audio";
import { useSelector, useDispatch } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";
import { FileUploadForm } from "../";
import { deleteSectionAsync } from "../../features";

export default function SectionColumn({
  userId,
  projectId,
  files,
  sectionDuration,
  sectionNumber,
  sectionId,
}) {
  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const [disabled, setDisabled] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [timeSnapshot, setTimeSnapshot] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(0);
  const [ended, setEnded] = React.useState(0);
  const [restart, setRestart] = React.useState(false);
  const [duration, setDuration] = React.useState(sectionDuration);
  const [loop, setLoop] = React.useState(false);

  const acPlusRef = React.useRef();
  React.useEffect(() => {
    if (!acPlusRef.current) acPlusRef.current = new AudioContextPlus();
  }, []);

  React.useEffect(() => {
    const createBuffers = async () => {
      // wait for raw audio to load before executing
      if (!Object.keys(audioRawFiles).length) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const raw = audioRawFiles[file.name];

        // const audioId = `user_${userId}_project_${projectId}_section_${sectionNumber}_file_${fileName}`;
        // let audio = document.getElementById(audioId);
        // if (!audio) {
        //   audio = document.createElement("audio");
        //   audio.setAttribute("id", audioId);
        // }
        const audio = undefined;
        await acPlusRef.current.createAudioBuffers(raw, audio, fileName);
      }
      setDisabled(false);
    };
    createBuffers();
  }, [userId, projectId, sectionNumber, files, audioRawFiles]);

  React.useEffect(() => {
    const getDuration = () => {
      if (!disabled) {
        const buffers = Object.values(acPlusRef.current.audioBuffers);
        const durations = buffers.map((x) => x.duration);
        const max = Math.max(...durations);
        setDuration(max);
      }
    };
    getDuration();
  }, [disabled]);

  const playSection = React.useCallback(async () => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setEnded(false);
    }
    await acPlusRef.current.playNSongs(
      files.map((x) => x.name),
      onEndCallback
    );
    setIsPlaying(acPlusRef.current.isPlaying);
  }, [ended, files]);

  const onEndCallback = () => {
    setEnded(true);
  };

  React.useEffect(() => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setCurrentTime(0);
      clearInterval(intervalId);
      setIntervalId(0);
      setIsPlaying(false);

      acPlusRef.current.started = false;
      acPlusRef.current.isPlaying = false;

      if (restart | loop) {
        playSection();
        setRestart(false);
      }
    }
  }, [intervalId, ended, playSection, restart, loop]);

  // Set the current time to display time passed on playback
  React.useEffect(() => {
    const playbackStarted = isPlaying;
    if (!playbackStarted) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
    if (playbackStarted & (intervalId === 0)) {
      const id = setInterval(function () {
        if (acPlusRef.current) {
          const time = acPlusRef.current.AC.currentTime;
          const position = time - timeSnapshot;
          setCurrentTime(position);
        }
      }, 1000);
      setIntervalId(id);
    }
  }, [isPlaying, intervalId, timeSnapshot, sectionDuration]);

  const restartOnClick = () => {
    if (!isPlaying) {
      playSection();
      return;
    }
    acPlusRef.current.sources.forEach((source) => {
      source.stop();
      source.disconnect();
    });
    setRestart(true);
  };

  const toggleLoop = () => {
    setLoop(!loop);
  };

  const [uploadFormActive, setUploadFormActive] = React.useState(null);
  const [singleSectionView, setSingleSectionView] = React.useState(null);
  const [togglePreviewButton, setTogglePreviewButton] = React.useState(true);
  React.useEffect(() => {
    const sectionColumns = document.querySelectorAll(".sectionColumn");
    const addNewSection = document.querySelector(".addNewSection");
    const sectionAnimations = document.querySelectorAll(".sectionAnimation");
    if (singleSectionView !== null) {
      for (let sectionColumn of sectionColumns) {
        if (Number(sectionColumn.id) !== singleSectionView)
          sectionColumn.classList.add("hidden");
      }
      for (let sectionAnimation of sectionAnimations) {
        if (Number(sectionAnimation.id) === singleSectionView)
          sectionAnimation.classList.remove("hidden");
      }
      addNewSection.classList.add("hidden");
    } else {
      for (let sectionColumn of sectionColumns) {
        sectionColumn.classList.remove("hidden");
      }
      for (let sectionAnimation of sectionAnimations) {
        sectionAnimation.classList.add("hidden");
      }
      addNewSection.classList.remove("hidden");
    }
  }, [singleSectionView]);

  // this needs redux logic to update state
  const dispatch = useDispatch();
  const handleDeleteSection = () => {
    dispatch(deleteSectionAsync(sectionId));
  };

  return (
    <Box className="sectionColumn" id={sectionNumber}>
      <Button type="button" onClick={() => handleDeleteSection()}>
        Delete Section
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Button
            type="button"
            onClick={() => {
              setSingleSectionView(sectionNumber);
              setTogglePreviewButton(false);
            }}
            sx={
              togglePreviewButton ? { display: "block" } : { display: "none" }
            }
          >
            Preview
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSingleSectionView(null);
              setTogglePreviewButton(true);
            }}
            sx={
              !togglePreviewButton ? { display: "block" } : { display: "none" }
            }
          >
            Exit Preview
          </Button>
          <Player
            title={`Section ${sectionNumber}`}
            isPlaying={isPlaying}
            currentTime={currentTime}
            playOnClick={playSection}
            restartOnClick={restartOnClick}
            disabled={disabled}
            duration={duration}
            loop={loop}
            toggleLoop={toggleLoop}
          />
        </Grid>
        {files && files.length
          ? files.map((file) => (
              <Grid key={file.id} item xs={6} md={8}>
                <FileCard file={file} projectId={projectId} />
              </Grid>
            ))
          : null}
        <Grid item xs={6} md={8} sx={{ display: "flex" }}>
          <Button
            type="button"
            onClick={() => setUploadFormActive(sectionNumber)}
          >
            Add a file
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => setUploadFormActive(null)}
            sx={
              sectionNumber !== uploadFormActive
                ? { display: "none" }
                : { display: "block" }
            }
          >
            X
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          sx={
            sectionNumber !== uploadFormActive
              ? { display: "none" }
              : { display: "block" }
          }
        >
          <FileUploadForm
            projectId={projectId}
            userId={userId}
            sectionId={sectionId}
            setUploadFormActive={setUploadFormActive}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
