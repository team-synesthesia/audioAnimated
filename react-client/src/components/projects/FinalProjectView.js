import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Link } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { fetchSingleProjectAsync, getFilesAsync } from "../../features/";

const FinalProjectView = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProjectAsync({ projectId }));
  }, [dispatch, projectId]);

  // all the info needed to generate the project should be available in the project variable!
  const project = useSelector((state) => state.singleProject);
  const { availableFiles } = project;

  useEffect(() => {
    if (Object.keys(availableFiles).length) {
      dispatch(getFilesAsync({ projectId, availableFiles }));
    }
  }, [dispatch, projectId, availableFiles]);

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const copyToClipboard = () => {
    const linkDiv = document.querySelector("#linkDiv");
    const url = linkDiv.innerText;
    navigator.clipboard.writeText(`${url}`);

    setShowCopiedMsg(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>Share using this link!</div>
      {showCopiedMsg ? <div>Copied to clipboard</div> : null}
      <Link
        component="button"
        underline="none"
        sx={{ display: "flex", alignItems: "center" }}
        onClick={copyToClipboard}
      >
        <div id="linkDiv">{window.location.href}</div>
        <ContentCopyIcon sx={{ marginLeft: "5px" }} />
      </Link>
    </Box>
  );
};

export default FinalProjectView;
