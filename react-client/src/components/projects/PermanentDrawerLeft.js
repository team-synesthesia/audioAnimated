import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import TransitionsModal from "./TransitionsModal";

const drawerWidth = 240;

export default function PermanentDrawerLeft({ projectId, userId }) {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState("");

  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
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
            <ListItemButton>
              <ListItemIcon>
                <BubbleChartIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Graphics Fn"}
                onClick={() => handleOpen("changeGraphicsFn")}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FileUploadIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Upload File"}
                onClick={() => handleOpen("uploadFile")}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LibraryMusicIcon />
              </ListItemIcon>
              <ListItemText primary={"Music Library"} />
            </ListItemButton>
          </ListItem>
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
