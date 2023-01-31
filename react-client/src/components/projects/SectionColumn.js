import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AudioContextPlus from "../../audio";
import { useSelector } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";

export default function SectionColumn({
  userId,
  projectId,
  files,
  sectionDuration,
  sectionNumber,
}) {
  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const [disabled, setDisabled] = React.useState(true);
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
        setDisabled(false);
      }
    };
    createBuffers();
  }, [userId, projectId, sectionNumber, files, audioRawFiles]);

  const [currentTime, setCurrentTime] = React.useState(0);
  const [timeSnapshot, setTimeSnapshot] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(0);

  const playSection = async () => {
    await acPlusRef.current.playNSongs(files.map((x) => x.name));
    setIsPlaying(acPlusRef.current.isPlaying);
  };

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
    setTimeSnapshot(acPlusRef.current.AC.currentTime);
    acPlusRef.current.sources.forEach((source) => {
      source.stop();
      source.disconnect();
    });
    acPlusRef.current.started = false;
    acPlusRef.current.isPlaying = false;
    setIsPlaying(false);
    playSection();
    setCurrentTime(0);
    clearInterval(intervalId);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Player
            title={`Section ${sectionNumber}`}
            isPlaying={isPlaying}
            currentTime={currentTime}
            playOnClick={playSection}
            restartOnClick={restartOnClick}
            disabled={disabled}
            duration={sectionDuration}
          />
        </Grid>
        {files && files.length
          ? files.map((file) => (
              <Grid key={file.id} item xs={6} md={8}>
                <FileCard file={file} />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
