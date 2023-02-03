import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { deleteFileAsync, addFileAsync } from "../../features";

const FileOptions = ({ handleClose, clickedFile }) => {
  const { sections } = useSelector((state) => state.singleProject);

  const dispatch = useDispatch();
  const handleDelete = (fileName) => {
    dispatch(deleteFileAsync({ deleteParam: fileName, type: "byName" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sectionCheckboxes = document.querySelectorAll(".sectionCheckbox");
    const sectionsToAssign = [];
    for (let sectionCheckbox of sectionCheckboxes) {
      sectionCheckbox.checked && sectionsToAssign.push(Number(sectionCheckbox.value));
    }
    for (let sectionToAssign of sectionsToAssign) {
      const { name, filePath, type, userId } = clickedFile;
      const data = {
        name,
        filePath,
        type,
        userId,
        sectionNumber: sectionToAssign,
      };
      dispatch(addFileAsync(data));
    }

    for (let sectionCheckbox of sectionCheckboxes) {
      sectionCheckbox.checked = false;
    }
    handleClose();
  };

  return (
    <div>
      <h1>{clickedFile.name}</h1>
      <form onSubmit={handleSubmit}>
        {sections.map((section) => (
          <div key={section.id}>
            <label htmlFor={"section " + section.sectionNumber}>
              Section {section.sectionNumber}
            </label>
            <input
              type="checkbox"
              name="selectSections"
              value={section.sectionNumber}
              id={"section " + section.sectionNumber}
              className="sectionCheckbox"
            />
          </div>
        ))}
        <Button type="submit">Assign to Section(s)</Button>
      </form>
      <Button
        type="button"
        size="small"
        onClick={() => {
          handleDelete(clickedFile.name);
          handleClose();
        }}
      >
        Delete File
      </Button>
    </div>
  );
};

export default FileOptions;
