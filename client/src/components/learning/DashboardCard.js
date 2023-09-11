import { useContext, useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  CardActions,
  FormControlLabel,
  Checkbox,
  Box,

} from "@mui/material";
import { UserContext } from "../../App";
import { binaryToBase64 } from "../../helpers/image-format-converter";
import { update } from "../../api/enroll-api";

const DashboardCard = ({ course, index, completed, readCourses }) => {
  const { userInfo } = useContext(UserContext);
  const [mentorName, setMentorName] = useState("");

  useEffect(() => {
    setMentorName(
      course.mentorId
        .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
        .join(", ")
    );
  }, [course]);

  const handleCompleted = (event) => {
    update(
      { studentId: userInfo.id, isCompleted: event.target.checked },
      course._id
    )
      .then(() => readCourses())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card
        sx={{
          width: 290,
          opacity: `${course?.isUnavailable === true ? "0.5" : "1"}`,
        }}
        id={`card-${index}`}
      >
        <CardMedia
          component="img"
          alt="course"
          height="180"
          src={`data:${course.image.contentType};base64,${binaryToBase64(
            course.image.data.data
          )}`}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            by {mentorName}
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            {course.description}
          </Typography>
          <Divider />
          <Typography variant="body1" color="text.secondary">
            <strong>Level:</strong> {course.level}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Duration:</strong> {course.duration}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {course?.isUnavailable ? (
              <Typography color="error">UNAVAILABLE!</Typography>
            ) : (
              <FormControlLabel
                control={
                  <Checkbox checked={completed} onClick={handleCompleted} />
                }
                label="Completed"
              />
            )}
          </Box>
        </CardActions>
      </Card>
    </>
  );
};

export default DashboardCard;
