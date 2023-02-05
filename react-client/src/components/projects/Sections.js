import * as React from "react";
import { Box } from "@mui/material";

import SectionColumn from "./SectionColumn";
import SingleSectionView from "./SingleSectionView";
import AddNewSection from "./AddNewSection";

export default function Sections({ sections, userId, projectId }) {

  const [singleSection, setSingleSection] = React.useState(false);
  const [selectedSectionId, setSelectedSectionId] = React.useState(1);
  const [selectedSection, setSelectedSection] = React.useState({});

  React.useEffect(() => {
    if (selectedSectionId) {
      setSelectedSection(sections.filter((x) => x.id === selectedSectionId)[0]);
    }
  }, [sections, selectedSectionId, setSelectedSection]);

  return (
    <div>
      {singleSection ? (
        <SingleSectionView
          setSingleSection={setSingleSection}
          section={selectedSection}
          userId={userId}
          projectId={projectId}
          files={selectedSection.files}
          sectionNumber={selectedSection.sectionNumber}
          sectionId={selectedSection.id}
        />
      ) : (
        <MultiSectionView
          setSingleSection={setSingleSection}
          setSelectedSectionId={setSelectedSectionId}
          sections={sections}
          projectId={projectId}
        />
      )}
    </div>
  );
}

function MultiSectionView({
  setSingleSection,
  setSelectedSectionId,
  sections,
  projectId,
}) {
  return (
    <Box
      sx={{
        marginLeft: "max(16vw,152px)",
        display: "flex",
        flexDirection: "row",
        gap: "1vw",
      }}
    >
      {sections && sections.length
        ? sections.map((section) => (
            <Box key={section.id} sx={{ flex: "1 0 10%" }}>
              <SectionColumn
                setSingleSection={setSingleSection}
                setSelectedSectionId={setSelectedSectionId}
                section={section}
                files={section.files}
                sectionNumber={section.sectionNumber}
                sectionId={section.id}
              />
            </Box>
          ))
        : null}
      <AddNewSection projectId={projectId} />
    </Box>
  );
}
