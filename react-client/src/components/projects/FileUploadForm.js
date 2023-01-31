import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@mui/material";

import { addFileAsync, fetchSingleProjectAsync } from "../../features";

const FileUploadForm = (props) => {
  const { projectId, sectionId, userId, setUploadFormActive } = props;

  const [name, setName] = useState("");
  const [file, setFile] = useState({});

  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    // if we want refresh, remove this line
    e.preventDefault();

    // access to file via file variable
    // console.log(file);

    const formData = {
      name,
      filePath: file.name,
      type: file.name.slice(-3),
      sectionId,
      userId,
    };

    await dispatch(addFileAsync(formData));

    setName("");
    setFile({});
    setUploadFormActive(null);
    // if we want no refresh, use this instead
    dispatch(fetchSingleProjectAsync({ projectId }));
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
