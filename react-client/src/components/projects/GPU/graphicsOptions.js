import * as React from "react";
import { setGraphicFN } from "../../../features/projects/playAllSlice";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../../features";

import { Box } from "@mui/material";

export const graphicsOptions = [
  { type: "shader", fn: 3, name: "\"Luminescent Tiles\"", imgUrl: "g2.jpg" },
  { type: "shader", fn: 2, name: "\"Gaz Inspired\"", imgUrl: "g1.jpg" },
  { type: "shader", fn: 1, name: "\"Ode To Julia\"", imgUrl: "g3.jpg" },
  { type: "shader", fn: 4, name: "\"D20 Bubbles\"", imgUrl: "g4.jpg" },
  { type: "shader", fn: 5, name: "\"Mandel Exp\"", imgUrl: "g5.jpg" },
  { type: "shader", fn: 6, name: "\"Color Companions\"", imgUrl: "g6.jpg" },
  { type: "vertex", fn: 0, name: "\"Dodeca-God Rays\"", imgUrl: "g0.jpg" },
];

let displayedLog = false;

export default function GraphicsOptions({ handleClose }) {
  const dispatch = useDispatch();

  //defaults to 0
  const { graphicFN } = useSelector((state) => state.playAll);
  const { id } = useSelector((state) => state.singleProject);

  //our dev server is always on port 3000
  const dev = window.location.port === "3000";

  if (!displayedLog) {
    console.log("dev", dev, window.location);
    displayedLog = true;
  }
  const devServer = "http://localhost:8080/";
  const prodUrl = window.origin + "/"

  console.log('prod origin',prodUrl)

  function SetGO(index) {
    dispatch(setGraphicFN(index));

    const projectId = id;
    const updateData = { graphicsFn: index };
    dispatch(updateProjectAsync({ projectId, updateData }));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Button
        size="small"
        color="error"
        onClick={handleClose}
        sx={{ alignSelf: "flex-end" }}
      >
        <CloseIcon />
      </Button>
      <Box key="graphicsOptions" id="graphicsOptions" sx={{ display: "flex" }}>
        {graphicsOptions.map((option, index) => (
          <div
            key={"div" + option.name}
            onClick={(ev) => {
              SetGO(index);
            }}
          >
            <img
              key={option.name}
              style={{ opacity: index === graphicFN ? "1" : null }}
              src={dev ? devServer + option.imgUrl : prodUrl + option.imgUrl}
              alt={option.name}
            ></img>
          </div>
        ))}
        <div id="graphicChosen">{graphicsOptions[graphicFN].name} selected</div>
      </Box>
    </Box>
  );
}
