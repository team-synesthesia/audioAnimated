import * as React from "react";
import { Box, Button } from "@mui/material";

import { AssignFileToSection } from "../";

export function ToggleAssignFileForm({
  section,
  sectionId,
  assignSectionFormActive,
  setAssignSectionFormActive,
}) {
  const toggle = (onOff, sectionId) => {
    if (onOff) setAssignSectionFormActive(sectionId);
    else setAssignSectionFormActive(false);
  };
  return (
    <div>
      {assignSectionFormActive === sectionId ? (
        <div>
          <Button
            size="small"
            color="error"
            onClick={() => toggle(false, sectionId)}
          >
            X
          </Button>

          <AssignFileToSection
            section={section}
            setAssignSectionFormActive={setAssignSectionFormActive}
          />
        </div>
      ) : (
        <Button type="button" onClick={() => toggle(true, sectionId)}>
          Add a file
        </Button>
      )}
    </div>
  );
}
