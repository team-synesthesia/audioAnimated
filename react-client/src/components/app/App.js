import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navbar, AppRoutes, StickyFooter } from "../";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const primaryColors = {
  0: "#4516BA",
  1: "#0D6056",
  // 2: "#FBD9E9",
  2: "#FE00FF",
  3: "#6D029D",
  4: "#F17803",
  5: "#C5A5F0",
  6: "#B1A8C5",
};

const SecondaryColors = {
  0: "#C33D3A",
  1: "#D9F024",
  2: "#D8FE5B",
  3: "#FF1DFA",
  4: "#83B022",
  5: "#8BFFFE",
  6: "#FFFEDF",
};

function getCustomTheme(index) {
  index = Number(index);
  if (!primaryColors[index]) return undefined;
  return createTheme({
    palette: {
      primary: {
        main: primaryColors[index],
      },
      secondary: {
        main: SecondaryColors[index],
      },
    },
  });
}

const App = ({ theme }) => {
  const [liveTheme, setLiveTheme] = useState(theme);
  const globalGraphicsFn = useSelector((state) => state.auth.globalGraphicsFn);
  console.log("here it is", globalGraphicsFn);
  useEffect(() => {
    console.log(globalGraphicsFn);
    if (globalGraphicsFn !== null) {
      const customTheme = getCustomTheme(globalGraphicsFn);
      if (customTheme) {
        setLiveTheme(customTheme);
      } else {
        setLiveTheme(theme);
      }
    }
  }, [globalGraphicsFn]);
  return (
    <div>
      <ThemeProvider theme={liveTheme}>
        <Navbar />
        <AppRoutes />
        <StickyFooter />
      </ThemeProvider>
    </div>
  );
};

export default App;
