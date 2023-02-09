import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Box, Input, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { addFileAsync, writeFileAsync, getFileAsync } from "../../features";

const FileUploadForm = (props) => {
  const { projectId, userId, handleClose } = props;

  const [name, setName] = useState("");
  const [file, setFile] = useState({});

  const dispatch = useDispatch();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name,
      filePath: file.name,
      type: file.name.slice(-3),
      userId,
      projectId,
    };

    dispatch(addFileAsync(formData));
    dispatch(writeFileAsync({ projectId, filePath: file.name, file }));
    dispatch(getFileAsync({ fileLabel: name, projectId, filePath: file.name }));

    setName("");
    setFile({});
    handleClose();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box>
          <label htmlFor="name">File Label: </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button
            color={file && file.name ? "primary" : "error"}
            sx={{ margin: "5px" }}
          >
            <label htmlFor="filePath">
              {file && file.name ? `${file.name}` : <FileUploadIcon />}
            </label>
          </Button>
          <Input
            id="filePath"
            type="file"
            accept=".ogg, .mp3"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            sx={{ display: "none" }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{ alignSelf: "flex-end" }}
        >
          <Typography>Submit</Typography>
        </Button>
      </Box>
    </form>
  );
};

export default FileUploadForm;
