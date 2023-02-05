import * as React from "react";
import { Box } from "@mui/material";

import AudioContextPlus from "../../audio";
import { useDispatch, useSelector } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";

import {setSectionToPlay, setFinished} from "../../features/projects/playAllSlice"

export default function MultiFilePlayer({
  title,
  files,
  sectionNumber,
  inSection,
  setGPUconfig,
  renderGraphics,
}) {

  const dispatch = useDispatch()

  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const { sectionToPlay, tryToStart } = useSelector(
    (state) => state.playAll );

  const {sections} = useSelector( state => state.singleProject )


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


  const [sectionPlayed,setSectionPlayed] = React.useState(-1)
  const playSection = React.useCallback( async () => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setEnded(false);
    }

    const onEndCallback = () => {
      setEnded(true);
    } 
    await acPlusRef.current.playNSongs(
        files.map((x) => x.name),
        onEndCallback)
    
    setIsPlaying(acPlusRef.current.isPlaying)

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


  React.useEffect(()=>{
 
      //loop  through  the sections array in index order
      try {

        if (tryToStart) {
          const sectionNum = sections[sectionToPlay].sectionNumber
          //I found that the only consistent way to get playAll moving was to track
          //these 4 states (sectionNum,sectionNumber,sectionPlayed,isPlaying)
          //and check for certain conditions, keying it off of 
          //onEndCallback was a disaster
          if ( !isPlaying & (sectionNum === sectionNumber) & sectionPlayed === -1 ) {
            playSection()
            setSectionPlayed(sectionNum)
          }
          else if ( !isPlaying & (sectionNum===sectionNumber)&(sectionPlayed===sectionNumber) ) {
            const nextSection = sectionToPlay+1
            setSectionPlayed(-1)
            if ( nextSection < sections.length) {    
              dispatch(setSectionToPlay(nextSection))
            }
            else {
              dispatch(setFinished(true))
            }
          }
  
        }
      }
      catch (err) {

      }
    
  },[playSection,sectionToPlay,ended,sectionPlayed,
    sectionNumber,sections,dispatch, isPlaying,tryToStart])


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <Player
        title={title}
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
              key={file.name}
              file={file}
              changeVolume={changeVolume}
              inSection={inSection}
            />
          ))
        : null}
    </Box>
  );
}
