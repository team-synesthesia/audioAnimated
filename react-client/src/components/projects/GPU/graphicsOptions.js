import * as React from "react";
import { setGraphicFN } from "../../../features/projects/playAllSlice";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../features";

export const graphicsOptions = [
  { type: "shader", fn: 3, name: "Luminescent Tiles", imgUrl: "g2.jpg" },
  { type: "shader", fn: 2, name: "Gaz Inspired", imgUrl: "g1.jpg" },
  { type: "shader", fn: 1, name: "Ode To Julia", imgUrl: "g3.jpg" },
  { type: "vertex", fn: 0, name: "Dodeca-God Rays", imgUrl: "g0.jpg" },
];

export default function GraphicsOptions({ handleClose }) {
  const dispatch = useDispatch();

  //defaults to 0
  const { graphicFN } = useSelector((state) => state.playAll);
  const { id } = useSelector((state) => state.singleProject);

  const dev = true;
  const devServer = "http://localhost:8080/";

  function SetGO(index) {
    dispatch(setGraphicFN(index));
    dispatch(updateProjectAsync(id, { graphicFn: index }));
  }

  return (
    <div key="graphicsOptions" id="graphicsOptions">
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
            src={dev ? devServer + option.imgUrl : option.imgUrl}
            alt={option.name}
          ></img>
        </div>
      ))}
      <div id="graphicChosen">{graphicsOptions[graphicFN].name} chosen</div>
      <Button onClick={handleClose}>
        <CloseIcon />
      </Button>
    </div>
  );
}
