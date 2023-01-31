import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@mui/material";

import { addFileAsync } from "../../features";

const FileUploadForm = (props) => {
  const { projectId, sectionId } = props;

  const [name, setName] = useState("");
  const [file, setFile] = useState({});

  const dispatch = useDispatch();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // access to file via file variable
    // console.log(file);

    const formData = {
      name,
      fileName: file.name,
      type: file.name.slice(-3),
      projectId,
      sectionId,
    };

    dispatch(addFileAsync(formData));

    setName("");
    setFile("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">File Name: </label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="filePath">File: </label>
        <input
          type="file"
          accept=".ogg, .mp3"
          name="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default FileUploadForm;
