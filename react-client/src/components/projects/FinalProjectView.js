import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Link } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { fetchSingleProjectAsync, getFilesAsync } from "../../features";

const FinalProjectView = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProjectAsync({ projectId }));
  }, [dispatch, projectId]);

  const project = useSelector((state) => state.singleProject);
  const { availableFiles } = project;

  useEffect(() => {
    if (Object.keys(availableFiles).length) {
      dispatch(getFilesAsync({ projectId, availableFiles }));
    }
  }, [dispatch, projectId, availableFiles]);

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const shareUrl = window.location.href;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareUrl}`);

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
      {showCopiedMsg ? <small>Copied to clipboard</small> : null}
      <Link
        component="button"
        underline="none"
        sx={{ display: "flex", alignItems: "center" }}
        onClick={copyToClipboard}
      >
        <div>{shareUrl}</div>
        <ContentCopyIcon sx={{ marginLeft: "5px" }} />
      </Link>
    </Box>
  );
};

export default FinalProjectView;
