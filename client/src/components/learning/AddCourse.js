import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Chip,
  Container,
  Card,
  Button,
  TextField,
  CardActions,
} from "@mui/material";
import { create } from "../../api/course-api";
import { durations, levels } from "../../helpers/filters";
import { isAuthenticated } from "../../api/user-api";
import { readUsers } from "../../api/admin-api";

const AddCourse = () => {
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
  const [currentUserMentorId, setCurrentUserMentorId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    isAuthenticated()
      .then((data) => {
        if (!data.user) return navigate("/login");

        if (!data.user.active) return navigate("/locked");
        if (data.user.role === "student") return navigate("/");
        setCurrentUserMentorId(data.user.id);
        setSelectedMentors([data.user.id]);
      })
      .catch((err) => console.log(err));

    readUsers().then((data) => {
      let tempArray = [];
      for (const user of data.users) {
        if (user.role === "mentor") tempArray.push(user);
      }
      setMentors(tempArray);
    });
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
        error: "Please enter Image !",
        redirect: false,
      });
      return false;
    }

    if (selectedMentors.length === 0) {
      setValues({
        ...values,
        error: "Please select at least one mentor!",
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

    create(formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, redirect: true, error: "" });
          toast.success("Course created successfully !");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      if (location.key === "default") {
        return navigate("/courses");
      } else {
        return navigate(-1);
      }
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  const handleDeleteMentor = (mentorId) => {
    if (mentorId === currentUserMentorId) {
      return;
    }
    setSelectedMentors((prevMentors) =>
      prevMentors.filter((mentor) => mentor !== mentorId)
    );
  };

  return (
    <Container>
      <Box sx={{ marginTop: "3rem", marginBottom: "5rem" }}>
        <Card sx={{ margin: "0 auto", width: 600, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: "#204e59" }}>
              Add Course
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
              onChange={handleImageChange}
              sx={{ margin: "1rem", width: 300 }}
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
                    onDelete={() => handleDeleteMentor(mentor)}
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
    </Container>
  );
};

export default AddCourse;
