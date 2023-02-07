import * as React from "react";
import { Card, Box, CardContent } from "@mui/material";

import AudioContextPlus from "../../audio";
import { useDispatch, useSelector } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";

import { addFileAsync, writeFileAsync } from "../../features";

import {
  setSectionToPlay,
  setFinished,
  setPlayAllCanvasCreated
} from "../../features/projects/playAllSlice";

import { GPU } from "./GPU/GPU"

export default function MultiFilePlayer({
  title,
  files,
  sectionNumber,
  inSection,
  setGPUconfig,
  renderGraphics,
  record,
  userId,
  projectId,
  setMsgKey,
  smallPlayer,
  setRecorded,
  newFileName,
  playAllCanvasRef,
  acRefs
}) {
  const dispatch = useDispatch();

  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const { sectionToPlay, tryToStart,
    finished, playAllCanvasCreated } = useSelector((state) => state.playAll);

  const { sections } = useSelector((state) => state.singleProject);

  const [disabled, setDisabled] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [timeSnapshot, setTimeSnapshot] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(0);
  const [ended, setEnded] = React.useState(0);
  const [restart, setRestart] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [loop, setLoop] = React.useState(false);
  const [recordedChunk, setRecordedChunk] = React.useState(new Blob());
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [saveRecording, setSaveRecording] = React.useState(false);

  const recorderRef = React.useRef();
  const recordStreamRef = React.useRef();

  if (record && !recordStreamRef.current) {
    getRecordingPermission();
  }

  function getRecordingPermission() {
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      let onSuccess = function (stream) {
        recordStreamRef.current = stream;
      };

      let onError = function (err) {
        console.log("The following error occured: " + err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  if (recordStreamRef.current && !recorderRef.current) {
    recorderRef.current = new MediaRecorder(recordStreamRef.current);

    recorderRef.current.ondataavailable = function (e) {
      setRecordedChunk(e.data);
    };

    recorderRef.current.onstop = async function () {
      setSaveRecording(true);
    };
  }

  React.useEffect(() => {
    if (recordedChunk.size > 0) {
      const newChunks = recordedChunks.concat(recordedChunk);
      setRecordedChunks(newChunks);
    }
    // intentionally leaving out 'recordedChunks' to avoid
    // infinite loop
  }, [recordedChunk]);

  React.useEffect(() => {
    const fnSaveRecording = async () => {
      const filePath = `${newFileName}.ogg`;

      const file = new Blob(recordedChunks, {
        type: "audio/ogg; codecs=opus",
      });

      const data = {
        name: newFileName,
        filePath,
        type: "ogg",
        userId: userId,
        projectId: projectId,
      };
      await dispatch(addFileAsync(data));
      await dispatch(writeFileAsync({ projectId, filePath, file }));
      setRecorded(true);
    };
    if (
      saveRecording &&
      (recordedChunks.length > 0) & (newFileName && newFileName.length > 0)
    ) {
      fnSaveRecording();
    }
  }, [dispatch, recordedChunks, saveRecording, userId, projectId, newFileName]);

  const acPlusRef = React.useRef();
  React.useEffect(() => {
    if (!acPlusRef.current) {
      acPlusRef.current = new AudioContextPlus();
    }
  }, []);

  if ( acPlusRef && acPlusRef.current &&
      acRefs.current && !acRefs.current[sectionNumber]) {
    console.log('saving acPlus ref for section',sectionNumber)
    acRefs.current[sectionNumber] = acPlusRef.current
  }

  React.useEffect(() => {
    const createBuffers = async () => {
      // wait for raw audio to load before executing
      if (!Object.keys(audioRawFiles).length || typeof files === "undefined")
        return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const raw = audioRawFiles[file.name];

        const audio = undefined;
        await acPlusRef.current.createAudioBuffers(raw, audio, fileName);
      }
      setDisabled(false);
    };
    createBuffers();
  }, [files, audioRawFiles]);

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

  const [sectionPlayed, setSectionPlayed] = React.useState(-1);

  const recordStartStop = async () => {
    if (recorderRef.current) {
      if (recorderRef.current.state === "recording") {
        recorderRef.current.stop();
        setMsgKey("stopped");
      } else if (["inactive", "paused"].includes(recorderRef.current.state)) {
        recorderRef.current.start();
        setMsgKey("recording");
      }
    }
  };

  const playSection = React.useCallback(async () => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setEnded(false);
    }
    const onEndCallback = () => {
      setEnded(true);
    };
    await acPlusRef.current.playNSongs(
      files.map((x) => x.name),
      onEndCallback
    );

    setIsPlaying(acPlusRef.current.isPlaying);
  }, [ended, files]);

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

  React.useEffect(() => {
    if (setMsgKey & !record) {
      if (isPlaying) setMsgKey("playing");
      else setMsgKey("stopped");
    }
  }, [record, isPlaying, setMsgKey]);

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

  const changeVolume = (value, fileName) => {
    if (!acPlusRef.current.started) {
      acPlusRef.current.loadSources(files.map((x) => x.name));
    }
    const fileIndex = files.map((x) => x.name === fileName).indexOf(true);
    acPlusRef.current.setGain(value, fileIndex);
  };

  React.useEffect(() => {
    if (renderGraphics) {
      setGPUconfig({
        isPlaying,
        acPlusRef: acPlusRef.current,
        sectionNumber,
        graphicsFn: sectionNumber - 1,
      });
    }
  }, [renderGraphics, isPlaying, sectionNumber, setGPUconfig]);

  const playAllCanvasCreatedRef = React.useRef(false)
  const newCanvasRef = React.useRef()

  if ( finished && playAllCanvasCreatedRef.current) {
    console.log('resetting canvas ref',sectionNumber)
    playAllCanvasRef.current = false
  }

  React.useEffect(() => {
    //loop  through  the sections array in index order
    try {
      if (tryToStart) {

        const sectionNum = sections[sectionToPlay].sectionNumber;

        if (sectionToPlay === 0 && 
            sectionNumber === sectionNum &&
            !playAllCanvasCreatedRef.current ) {
          console.log('acRefs',acRefs.current.slice(0,5))
          const newCanvas = document.createElement('div')
          playAllCanvasRef.current.appendChild(newCanvas)
          newCanvas.style.width = "95vw"
          newCanvas.style.height = "75vh"
          newCanvas.style.backgroundColor = "blue"
          newCanvasRef.current = newCanvas
          playAllCanvasCreatedRef.current = true
        }

        //I found that the only consistent way to get playAll moving was to track
        //these 4 states (sectionNum,sectionNumber,sectionPlayed,isPlaying)
        //and check for certain conditions, keying it off of
        //onEndCallback was a disaster
        if (
          !isPlaying &
          (sectionNum === sectionNumber) &
          (sectionPlayed === -1)
        ) {
          playSection();
          setSectionPlayed(sectionNum);
        } else if (
          !isPlaying &
          (sectionNum === sectionNumber) &
          (sectionPlayed === sectionNumber)
        ) {
          const nextSection = sectionToPlay + 1;
          setSectionPlayed(-1);
          if (nextSection < sections.length) {
            dispatch(setSectionToPlay(nextSection));
            console.log(sectionNumber)
          } else {
            dispatch(setFinished(true));
            console.log('trying to remove it')
            playAllCanvasRef.current.removeChild(playAllCanvasRef.current.firstChild)
            dispatch(setPlayAllCanvasCreated(false))
            console.log('canvas ref after child birth',playAllCanvasRef)
            playAllCanvasRef.current.innerHTML= "xxxxxxxxxxxxxxxxxxxx"
          }
        }
      }
    } catch (err) {}
  }, [
    playSection,
    sectionToPlay,
    ended,
    sectionPlayed,
    sectionNumber,
    sections,
    dispatch,
    isPlaying,
    tryToStart,
    playAllCanvasRef,
    acRefs
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <Player
        title={title}
        isPlaying={isPlaying}
        currentTime={currentTime}
        playOnClick={playSection}
        recordStartStop={recordStartStop}
        restartOnClick={restartOnClick}
        disabled={disabled}
        duration={duration}
        loop={loop}
        toggleLoop={toggleLoop}
        record={record}
      />
      {smallPlayer === true ? (
        <Card>
          <CardContent>
            <Files
              files={files}
              changeVolume={changeVolume}
              inSection={inSection}
              smallPlayer={smallPlayer}
            />
          </CardContent>
        </Card>
      ) : (
        <Files
          files={files}
          changeVolume={changeVolume}
          inSection={inSection}
        />
      )}
    </Box>
  );
}

function Files({ files, changeVolume, inSection, smallPlayer }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      {files && files.length
        ? files.map((file) => (
            <FileCard
              key={file.name}
              file={file}
              changeVolume={changeVolume}
              inSection={inSection}
              smallPlayer={smallPlayer}
            />
          ))
        : null}
    </Box>
  );
}
