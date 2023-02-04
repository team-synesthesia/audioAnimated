import * as React from "react";
import { Box, Grid, Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Tooltip from "@mui/material/Tooltip";

import AudioContextPlus from "../../audio";
import { useSelector, useDispatch } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";
import { AssignFileToSection } from "../";
import { deleteSectionAsync } from "../../features";

export default function SectionColumn({
  section,
  userId,
  projectId,
  files,
  sectionNumber,
  sectionId,
  setGPUconfig,
  setCanvasInitialized,
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
  const [duration, setDuration] = React.useState(0);
  const [loop, setLoop] = React.useState(false);

  const acPlusRef = React.useRef();
  React.useEffect(() => {
    if (!acPlusRef.current) acPlusRef.current = new AudioContextPlus();
  }, []);

  React.useEffect(() => {
    const createBuffers = async () => {
      // wait for raw audio to load before executing
      if (!Object.keys(audioRawFiles).length || typeof files === "undefined")
        return;

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
        if (durations.length) {
          const max = Math.max(...durations);
          setDuration(max);
        }
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
  }, [isPlaying, intervalId, timeSnapshot]);

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

  const [AssignSectionFormActive, setAssignSectionFormActive] =
    React.useState(null);
  const [singleSectionView, setSingleSectionView] = React.useState(null);
  const [togglePreviewButton, setTogglePreviewButton] = React.useState(true);

  const [attachGPU, setAttachGPU] = React.useState(false);

  React.useEffect(() => {
    const sectionColumns = document.querySelectorAll(".sectionColumn");
    const addNewSection = document.querySelector(".addNewSection");
    const sectionAnimation = document.getElementById("sectionAnimation");
    if (singleSectionView !== null) {
      sectionAnimation.classList.remove("hidden");
      if (!attachGPU) {
        setAttachGPU(true);
      }
      for (let sectionColumn of sectionColumns) {
        if (Number(sectionColumn.id) !== singleSectionView)
          sectionColumn.classList.add("hidden");
      }
      addNewSection.classList.add("hidden");
    } else {
      sectionAnimation.classList.add("hidden");

      for (let sectionColumn of sectionColumns) {
        sectionColumn.classList.remove("hidden");
      }
      addNewSection.classList.remove("hidden");
    }
  }, [singleSectionView, attachGPU]);

  const changeVolume = (value, fileName) => {
    if (!acPlusRef.current.started) {
      acPlusRef.current.loadSources(files.map((x) => x.name));
    }
    const fileIndex = files.map((x) => x.name === fileName).indexOf(true);
    acPlusRef.current.setGain(value, fileIndex);
  };

  React.useEffect(() => {
    if (attachGPU) {
      setGPUconfig({
        isPlaying,
        acPlusRef: acPlusRef.current,
        sectionNumber,
        graphicsFn: sectionNumber - 1,
      });
    }
  }, [attachGPU, isPlaying, sectionNumber, setGPUconfig]);

  const dispatch = useDispatch();
  const handleDeleteSection = () => {
    dispatch(deleteSectionAsync(sectionId));
  };

  return (
    <Box
      className="sectionColumn"
      id={sectionNumber}
      sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Preview">
          <IconButton
            type="button"
            onClick={() => {
              setSingleSectionView(sectionNumber);
              setTogglePreviewButton(false);
            }}
            sx={
              togglePreviewButton ? { display: "block" } : { display: "none" }
            }
          >
            <BubbleChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Exit Preview">
          <IconButton
            type="button"
            onClick={() => {
              setSingleSectionView(null);
              setTogglePreviewButton(true);
            }}
            sx={
              !togglePreviewButton
                ? { display: "block", color: "green" }
                : { display: "none" }
            }
          >
            <BubbleChartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Section">
          <IconButton type="button" sx={{ "&:hover": { color: "red" } }}>
            <RemoveCircleOutlineIcon onClick={() => handleDeleteSection()} />
          </IconButton>
        </Tooltip>
      </Box>

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
      {files && files.length
        ? files.map((file) => (
            <FileCard
              file={file}
              projectId={projectId}
              changeVolume={changeVolume}
            />
          ))
        : null}
      <Grid item xs={6} md={8} sx={{ display: "flex" }}>
        <Button
          type="button"
          onClick={() => setAssignSectionFormActive(sectionNumber)}
        >
          Add a file
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => setAssignSectionFormActive(null)}
          sx={
            sectionNumber !== AssignSectionFormActive
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
          sectionNumber !== AssignSectionFormActive
            ? { display: "none" }
            : { display: "block" }
        }
      >
        <AssignFileToSection
          // projectId={projectId}
          // userId={userId}
          section={section}
          sectionId={sectionId}
          setAssignSectionFormActive={setAssignSectionFormActive}
        />
      </Grid>
    </Box>
  );
}
