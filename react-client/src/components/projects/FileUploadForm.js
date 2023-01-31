import React, { useState } from "react";

import { Button } from "@mui/material";

const FileUploadForm = (props) => {
  const { projectId } = props;

  const [name, setName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [type, setType] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // send this to redux
    // const formData = {name, filePath, type, projectId, sectionId}
    console.log(name, filePath, type, projectId);
    // where to get sectionId?
    // filePath must be cleaned up
    // should I make a new redux state for files??? state gets super complicated in singleProjectSlice

    setName("");
    setFilePath("");
    setType("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">File Name: </label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="filePath">File: </label>
        <input
          type="file"
          accept=".ogg, .mp3"
          name="filePath"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <label htmlFor="type">File Type: </label>
        <input
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default FileUploadForm;
