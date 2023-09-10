import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Box,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import { create } from "../../api/user-api";
import { ScreenWidthContext, UserContext } from "../../App";

const AdminAddUser = () => {
  const { screenWidth } = useContext(ScreenWidthContext);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    active: false,
    numberOfProjects: 0,
    role: "student",
    error: "",
  });
  const [userImage, setUserImage] = useState();
  const [displayImage, setDisplayImage] = useState();

  const handleValuesChange = (name) => (event) => {
    setUser({ ...user, [name]: event.target.value });
  };
  const handleImageChange = (event) => {
    setUserImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDisplayImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!user.firstName) {
      setUser({ ...user, error: "Please enter First Name !" });
      return;
    }

    if (!user.lastName) {
      setUser({ ...user, error: "Please enter Last Name !" });
      return;
    }

    if (!user.email) {
      setUser({ ...user, error: "Please enter Email !" });
      return;
    }
    if (!user.password) {
      setUser({ ...user, error: "Please enter Password !" });
      return;
    }

    const formData = new FormData();
    formData.append("image", userImage);
    formData.append("user", JSON.stringify(user));

    create(formData).then((data) => {
      if (data.error) {
        setUser({ ...user, error: data.error });
      } else {
        toast.success("User added successfully !");
        navigate(`/admin-dashboard/${userInfo.id}`);
      }
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        textAlign={"center"}
        mt={5}
        sx={{ color: "#204e59" }}
      >
        Add User
      </Typography>
      <Grid container spacing={1} mt={5} sx={{ marginBottom: "5rem" }}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="firstName"
              label="First Name"
              type="text"
              value={user.firstName}
              onChange={handleValuesChange("firstName")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="lastName"
              label="Last Name"
              type="text"
              value={user.lastName}
              onChange={handleValuesChange("lastName")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={user.email}
              onChange={handleValuesChange("email")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={user.password}
              onChange={handleValuesChange("password")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />

            <FormControlLabel
              control={
                <Checkbox
                  checked={user.active}
                  onClick={(e) =>
                    setUser({ ...user, active: e.target.checked })
                  }
                />
              }
              label="Active"
            />

            <Box sx={{ width: 300 }}>
              <FormControl fullWidth>
                <InputLabel id="edit-role">Role</InputLabel>
                <Select
                  labelId="edit-role"
                  value={user.role}
                  label="Role"
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                >
                  <MenuItem value={"student"}>Student</MenuItem>
                  <MenuItem value={"mentor"}>Mentor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {screenWidth > 500 && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                {user.error && (
                  <Typography component="p" color="error">
                    {user.error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "#204e59",
                    marginTop: "1rem",
                    "&:hover": {
                      backgroundColor: "#154043",
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
              sx={{ margin: "1rem", width: 300, mt: 3 }}
            />
          </Box>

          {screenWidth < 500 && (
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              {user.error && (
                <Typography component="p" color="error">
                  {user.error}
                </Typography>
              )}
              <Button
                variant="contained"
                mt={3}
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
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminAddUser;
