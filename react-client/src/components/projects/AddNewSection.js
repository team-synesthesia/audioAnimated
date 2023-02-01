import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CardContent from "@mui/material/CardContent";
import { createSectionAsync } from "../../features";

export default function AddNewSection({ projectId }) {
  const dispatch = useDispatch();

  const addNewSection = () => {
    dispatch(createSectionAsync({ projectId }));
  };
  return (
    <Box sx={{ flexGrow: 1 }} className="addNewSection">
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Card
            sx={{
              minWidth: 210,
              minHeight: 180,
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <CardActionArea onClick={addNewSection}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  {"Add Section"}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <AddRoundedIcon
                    sx={{
                      fontSize: "6.0em",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
