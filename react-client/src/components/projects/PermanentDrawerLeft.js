import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MicIcon from "@mui/icons-material/Mic";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PauseIcon from "@mui/icons-material/Pause";

import TransitionsModal from "./TransitionsModal";

import { useDispatch } from "react-redux";
import { setPlayAllStarted, setPlayAllPlayPause } from "../../features";

const drawerWidth = "12vw";
const minWidth = 150;

export default function PermanentDrawerLeft({ projectId, userId }) {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const [showMusicLibrary, setShowMusicLibrary] = React.useState(false);
  const [clickedFile, setClickedFile] = React.useState({});

  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    if (acPlusRefs.recordPlayback.current.isPlaying) {
      acPlusRefs.recordPlayback.current.AC.suspend();
    }
    setOpen(false);
  };

  const { availableFiles, name } = useSelector((state) => state.singleProject);
  const availableFilesValues = Object.values(availableFiles);
  const { playAllStarted, playAllPlayPause } = useSelector(
    (state) => state.playAll
  );
  const dispatch = useDispatch();

  const acPlusRefs = {
    record: React.useRef(),
    recordPlayback: React.useRef(),
  };

  if (acPlusRefs.record.current) {
    acPlusRefs.record.current.started = false;
    acPlusRefs.record.current.isPlaying = false;
    acPlusRefs.record.current.currentTime = 0;
    // if (acPlusRefs.record.current.sources) {
    //   acPlusRefs.record.current.sources.forEach((source) => {
    //     source.stop();
    //     source.disconnect();
    //   });
    // }
  }
  if (acPlusRefs.recordPlayback.current) {
    acPlusRefs.recordPlayback.current.started = false;
    acPlusRefs.recordPlayback.current.isPlaying = false;
    acPlusRefs.recordPlayback.current.currentTime = 0;
    // if (acPlusRefs.recordPlayback.current.sources) {
    //   acPlusRefs.recordPlayback.current.sources.forEach((source) => {
    //     source.stop();
    //     source.disconnect();
    //   });
    // }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          minWidth: minWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            minWidth: minWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <TransitionsModal
          projectId={projectId}
          userId={userId}
          open={open}
          handleClose={handleClose}
          type={modalType}
          clickedFile={clickedFile}
          availableFiles={availableFiles}
          acPlusRefs={acPlusRefs}
        />
        <List>
          <ListItem disablePadding sx={{ minWidth: "0" }}>
            <ListItemButton onClick={() => handleOpen("editProjectName")}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <DriveFileRenameOutlineIcon />
              </ListItemIcon>
              <ListItemText
                primary={name}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ minWidth: "0" }}>
            <ListItemButton onClick={() => handleOpen("editProjectLatencyFix")}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <DriveFileRenameOutlineIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Edit Latency Adj"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("changeGraphicsFn")}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <BubbleChartIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Graphics Fn"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              /* onClick={() => handleOpen("playAll")} */
              onClick={() => {
                if (!playAllStarted) {
                  dispatch(setPlayAllStarted(true));
                  dispatch(setPlayAllPlayPause(true));
                } else if (playAllPlayPause) {
                  dispatch(setPlayAllPlayPause(false));
                } else {
                  dispatch(setPlayAllPlayPause(true));
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                {!playAllStarted || (playAllStarted && !playAllPlayPause) ? (
                  <VideoLibraryIcon />
                ) : (
                  <PauseIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={"Play  All"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>

          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("record")}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <MicIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Record a new layer"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("uploadFile")}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <FileUploadIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Upload File"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                !showMusicLibrary
                  ? setShowMusicLibrary(true)
                  : setShowMusicLibrary(false);
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <LibraryMusicIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Music Library"}
                primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
              />
            </ListItemButton>
          </ListItem>
          {showMusicLibrary ? (
            availableFiles && availableFilesValues.length ? (
              availableFilesValues.map((file) => (
                <ListItem key={file.id}>
                  <ListItemButton
                    onClick={() => {
                      handleOpen("fileOptions");
                      setClickedFile(file);
                    }}
                  >
                    <ListItemIcon>
                      <MusicNoteIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{ fontSize: "max(1vw, 12px)" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItemText
                primary={"No music available :("}
                sx={{ marginLeft: "5px" }}
              />
            )
          ) : null}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
