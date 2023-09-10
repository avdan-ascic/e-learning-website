import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ScreenWidthContext, UserContext } from "../../App";
import { binaryToBase64 } from "../../helpers/image-format-converter";
import { create, readByStudent } from "../../api/enroll-api";
import Popup from "../../helpers/popup.styled";

const CourseCard = ({ course, index }) => {
  const { screenWidth } = useContext(ScreenWidthContext);
  const { userInfo } = useContext(UserContext);
  const [popupOpen, setPopupOpen] = useState(false);
  const [disalbeEnroll, setDisableEnroll] = useState(false);
  const navigate = useNavigate();

  const handlePopupOpen = () => {
    if (userInfo.role !== "student") return;
    if (course?.isUnavailable === true) return;
    setPopupOpen(true);

    let popup = document.getElementById(`popup-${index}`);
    let card = document.getElementById(`card-${index}`);
    popup.style.top = `${
      card.getBoundingClientRect().top + window.scrollY - 100
    }px`;
    popup.style.left =
      screenWidth > 400 ? `${card.getBoundingClientRect().left - 65}px` : "2%";
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleEnroll = () => {
    create({ studentId: userInfo.id }, course._id)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (userInfo?.role !== "student") {
      setDisableEnroll(true);
    }

    readByStudent(userInfo.id)
      .then((data) => {
        for (const c of data.courses) {
          if (c.courseId._id === course._id) {
            setDisableEnroll(true);
            break;
          } else {
            setDisableEnroll(false);
          }
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [userInfo, course]);

  return (
    <>
      <Card
        sx={{
          width: screenWidth < 350 ? 230 : 290,
          opacity: `${course?.isUnavailable === true ? ".5" : "1"}`,
        }}
        onMouseEnter={handlePopupOpen}
        onMouseLeave={handlePopupClose}
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
            {course.description}
          </Typography>
          <Divider />
          <Typography variant="body1" color="text.secondary">
            <strong>Level:</strong> {course.level}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Duration:</strong> {course.duration}
          </Typography>
          {course?.isUnavailable === true && (
            <>
              <Divider />
              <Typography color="error">UNAVAILABLE!</Typography>
            </>
          )}
        </CardContent>
      </Card>
      <Popup
        id={`popup-${index}`}
        open={popupOpen}
        onMouseEnter={handlePopupOpen}
        onMouseLeave={handlePopupClose}
      >
        <Box sx={{ p: 1, width: 500, maxWidth: "90%" }}>
          <Typography variant="h6">What you will learn</Typography>
          <ul>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque malesuada, eros sit amet venenatis commodo, metus
              ipsum ultricies massa, at tempor diam orci a nibh.
            </li>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque malesuada, eros sit amet venenatis commodo, metus
              ipsum ultricies massa, at tempor diam orci a nibh.
            </li>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque malesuada, eros sit amet venenatis commodo, metus
              ipsum ultricies massa, at tempor diam orci a nibh.
            </li>
          </ul>
          <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
            <Button
              variant="contained"
              onClick={handleEnroll}
              disabled={disalbeEnroll}
              sx={{
                backgroundColor: "#204e59",
                "&:hover": {
                  backgroundColor: "#154043",
                },
              }}
            >
              Enroll Now!
            </Button>
          </Box>
        </Box>
      </Popup>
    </>
  );
};

export default CourseCard;
