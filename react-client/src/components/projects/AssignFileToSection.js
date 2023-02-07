import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { addFileAsync } from "../../features";

const AssignFileToSection = ({ setAssignSectionFormActive, section }) => {
  const { availableFiles, id } = useSelector((state) => state.singleProject);
  const fileNames = [];

  const dispatch = useDispatch();

  section.files && section.files.forEach((file) => fileNames.push(file.name));

  const unassignedFiles = Object.values(availableFiles).filter(
    (file) => !fileNames.includes(file.name)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const fileCheckboxes = document.querySelectorAll(".fileCheckbox");
    const filesToAssign = [];
    for (let fileCheckbox of fileCheckboxes) {
      fileCheckbox.checked && filesToAssign.push(fileCheckbox.value);
    }
    for (let fileName of filesToAssign) {
      const { name, filePath, type, userId } = availableFiles[fileName];
      const data = {
        name,
        filePath,
        type,
        userId,
        sectionNumber: section.sectionNumber,
        projectId: id,
      };
      dispatch(addFileAsync(data));
    }

    for (let fileCheckbox of fileCheckboxes) {
      fileCheckbox.checked = false;
    }
    setAssignSectionFormActive(null);
  };

  return unassignedFiles && unassignedFiles.length ? (
    <form onSubmit={handleSubmit}>
      {unassignedFiles.map(
        (file) =>
          !fileNames.includes(file.name) && (
            <div key={file.id}>
              <label htmlFor={file.name}>{file.name}</label>
              <input
                type="checkbox"
                name="selectFile"
                value={file.name}
                id={file.name}
                className="fileCheckbox"
              />
            </div>
          )
      )}
      <Button type="submit">Submit</Button>
    </form>
  ) : (
    <div>No files to add</div>
  );
};

export default AssignFileToSection;
