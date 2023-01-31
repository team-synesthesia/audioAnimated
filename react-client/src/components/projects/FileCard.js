import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useDispatch } from "react-redux";
import { deleteFileAsync, fetchSingleProjectAsync } from "../../features";

export default function FileCard({ file, projectId }) {
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    await dispatch(deleteFileAsync(id));
    dispatch(fetchSingleProjectAsync({ projectId }));
  };

  return (
    <Card sx={{ minWidth: 250 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {file.createdAt}
        </Typography>
        <Typography variant="h5" component="div">
          {file.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`Creator ID: ${file.userId} (Change this to creator name later)`}
        </Typography>
        <Typography variant="body2">Duration ("add this later")</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
      <CardActions>
        <Button
          type="button"
          size="small"
          onClick={() => handleDelete(file.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
