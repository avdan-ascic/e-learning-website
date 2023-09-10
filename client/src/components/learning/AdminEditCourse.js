import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Stack,
  CardContent,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  TextField,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { readById, update } from "../../api/course-api";
import { readUsers } from "../../api/admin-api";
import { UserContext } from "../../App";
import { durations, levels } from "../../helpers/filters";
import { binaryToBase64 } from "../../helpers/image-format-converter";

const AdminEditCourse = () => {
  const { userInfo } = useContext(UserContext);
  const [values, setValues] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    redirect: false,
    error: "",
  });
  const [mentors, setMentors] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [courseImage, setCourseImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    readUsers().then((data) => {
      let tempArr = [];
      for (const user of data.users) {
        if (user.role === "mentor") tempArr.push(user);
      }
      setMentors(tempArr);
    });

    readById(params.id)
      .then((data) => {
        setValues({
          ...values,
          title: data.course.title,
          description: data.course.description,
          level: data.course.level,
          duration: data.course.duration,
        });
        setCourseImage(data.course.image);
        setDisplayImage(
          `data:${data.course.image.contentType};base64,${binaryToBase64(
            data.course.image.data.data
          )}`
        );
        setSelectedMentors(data.course.mentorId);
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleImageChange = (event) => {
    setCourseImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDisplayImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMentor = (event) => {
    if (!selectedMentors.includes(event.target.value)) {
      setSelectedMentors([...selectedMentors, event.target.value]);
    }
  };

  const validateForm = () => {
    if (!values.title) {
      setValues({
        ...values,
        error: "Please enter Title !",
        redirect: false,
      });
      return false;
    }

    if (!values.description) {
      setValues({
        ...values,
        error: "Please enter Description !",
        redirect: false,
      });
      return false;
    }

    if (!values.level) {
      setValues({
        ...values,
        error: "Please enter Level !",
        redirect: false,
      });
      return false;
    }

    if (!values.duration) {
      setValues({
        ...values,
        error: "Please enter Duration !",
        redirect: false,
      });
      return false;
    }

    if (!courseImage) {
      setValues({
        ...values,
        error: "Please enter Image  !",
        redirect: false,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    values.mentorId = selectedMentors;

    const formData = new FormData();
    formData.append("image", courseImage);
    formData.append("course", JSON.stringify(values));

    update(formData, params.id)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, redirect: true, error: "" });
          toast.success("Course updated successfully !");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      if (location.key === "default") {
        return navigate(`/admin-dashboard/${userInfo.id}`);
      } else {
        return navigate(-1);
      }
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <>
      <Box sx={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <Card sx={{ margin: "0 auto", width: 600, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: "#204e59", mb: 5 }}>
              Edit Course
            </Typography>
            <TextField
              id="title"
              label="Title"
              type="text"
              value={values.title}
              onChange={handleChange("title")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="description"
              label="Description"
              type="text"
              value={values.description}
              onChange={handleChange("description")}
              multiline
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <Box sx={{ width: 300, mx: "auto" }}>
              <FormControl fullWidth>
                <InputLabel id="select-level">Level</InputLabel>
                <Select
                  labelId="select-level"
                  value={values.level}
                  label="Level"
                  onChange={(e) =>
                    setValues({ ...values, level: e.target.value })
                  }
                >
                  {levels.map((lvl, index) => {
                    return (
                      <MenuItem key={index} value={lvl}>
                        {lvl}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <br />
            <Box sx={{ width: 300, mx: "auto" }}>
              <FormControl fullWidth>
                <InputLabel id="select-duration">Duration</InputLabel>
                <Select
                  labelId="select-duration"
                  value={values.duration}
                  label="Duration"
                  onChange={(e) =>
                    setValues({ ...values, duration: e.target.value })
                  }
                >
                  {durations.map((dur, index) => {
                    return (
                      <MenuItem key={index} value={dur}>
                        {dur}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <br />

            {displayImage && (
              <img
                src={displayImage}
                style={{
                  maxHeight: "250px",
                  maxWidth: "300px",
                  objectFit: "contain",
                  margintTop: "2rem",
                  marginBottom: "1rem",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                alt="User"
              />
            )}
            <TextField
              type="file"
              sx={{ margin: "1rem", width: 300 }}
              onChange={handleImageChange}
            />

            <Box sx={{ width: 300, mx: "auto", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="select-mentors">Mentors</InputLabel>
                <Select
                  labelId="select-mentors"
                  value={""}
                  label="Mentors"
                  onChange={handleAddMentor}
                >
                  {mentors.map((mentor, index) => {
                    return (
                      <MenuItem key={index} value={mentor._id}>
                        {`${mentor.firstName} ${mentor.lastName}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            {selectedMentors.length > 0 &&
              selectedMentors.map((mentor, index) => {
                return (
                  <Chip
                    key={index}
                    label={
                      mentors[mentors.findIndex((obj) => obj._id === mentor)]
                        ?.firstName +
                      " " +
                      mentors[mentors.findIndex((obj) => obj._id === mentor)]
                        ?.lastName
                    }
                    onDelete={() =>
                      setSelectedMentors(
                        selectedMentors.filter((m) => m !== mentor)
                      )
                    }
                  />
                );
              })}

            {values.error && (
              <Typography component="p" color="error">
                {values.error}
              </Typography>
            )}
          </CardContent>

          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#204e59",
                  "&:hover": {
                    backgroundColor: "#154043",
                  },
                }}
              >
                Submit
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default AdminEditCourse;
