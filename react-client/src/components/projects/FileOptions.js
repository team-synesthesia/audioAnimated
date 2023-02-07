import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";

import { DeleteConfirmation } from "../";
import { deleteFileAsync, addFileAsync } from "../../features";

const FileOptions = ({ handleClose, clickedFile }) => {
  const { sections, id } = useSelector((state) => state.singleProject);

  const dispatch = useDispatch();
  const handleDelete = (fileName) => {
    dispatch(deleteFileAsync({ deleteParam: fileName, type: "byName" }));
  };

  const sectionsToAssign = [];
  const handleCheckBox = (sectionNumber, checked) => {
    if (!sectionsToAssign.includes(sectionNumber) && checked) {
      sectionsToAssign.push(sectionNumber);
    } else {
      const spliceIndex = sectionsToAssign.indexOf();
      sectionsToAssign.splice(spliceIndex, 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let sectionToAssign of sectionsToAssign) {
      const { name, filePath, type, userId } = clickedFile;
      const data = {
        name,
        filePath,
        type,
        userId,
        sectionNumber: sectionToAssign,
        projectId: id,
      };
      dispatch(addFileAsync(data));
    }

    handleClose();
  };

  return (
    <Box>
      <h1>{clickedFile.name}</h1>
      <DeleteConfirmation
        handleDelete={handleDelete}
        deleteParam={clickedFile.name}
        origin={"FileOptions"}
      />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {sections.map((section) => (
            <FormControlLabel
              key={section.id}
              control={<Checkbox />}
              label={`Section ${section.sectionNumber}`}
              name={String(section.sectionNumber)}
              onChange={(_, value) =>
                handleCheckBox(section.sectionNumber, value)
              }
            />
          ))}
          <Button type="submit" sx={{ alignSelf: "flex-end" }}>
            Assign to Section(s)
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FileOptions;
