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

import TransitionsModal from "./TransitionsModal";

const drawerWidth = "15vw";
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

  const handleClose = () => setOpen(false);

  const { availableFiles } = useSelector((state) => state.singleProject);

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
        />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DriveFileRenameOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={"Edit Project Name"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("changeGraphicsFn")}>
              <ListItemIcon>
                <BubbleChartIcon />
              </ListItemIcon>
              <ListItemText primary={"Graphics Fn"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("playAll")}>
              <ListItemIcon>
                xxx
              </ListItemIcon>
              <ListItemText primary={"Play  All"} />
            </ListItemButton>
          </ListItem>


          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("record")}>
              <ListItemIcon>
                <MicIcon />
              </ListItemIcon>
              <ListItemText primary={"Record a new layer"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleOpen("uploadFile")}>
              <ListItemIcon>
                <FileUploadIcon />
              </ListItemIcon>
              <ListItemText primary={"Upload File"} />
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
              <ListItemIcon>
                <LibraryMusicIcon />
              </ListItemIcon>
              <ListItemText primary={"Music Library"} />
            </ListItemButton>
          </ListItem>
          {showMusicLibrary &&
            Object.values(availableFiles).map((file) => (
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
                  <ListItemText primary={file.name} />
                </ListItemButton>
              </ListItem>
            ))}
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
