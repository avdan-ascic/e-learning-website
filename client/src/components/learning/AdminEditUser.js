import { useState, useEffect, useContext } from "react";
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
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { readUserById, updateUser } from "../../api/admin-api";
import { ScreenWidthContext, UserContext } from "../../App";
import { binaryToBase64 } from "../../helpers/image-format-converter";

const AdminEditUser = () => {
  const { screenWidth } = useContext(ScreenWidthContext);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    active: false,
    role: "",
    error: "",
  });
  const [userImage, setUserImage] = useState();
  const [displayImage, setDisplayImage] = useState();

  useEffect(() => {
    readUserById(params.id).then((data) => {
      setUser({
        ...user,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        active: data.user.active,
        role: data.user.role,
      });
      if (data.user.image) {
        setUserImage(data.user.image);
        setDisplayImage(
          `data:${data.user.image.contentType};base64,${binaryToBase64(
            data.user.image.data.data
          )}`
        );
      }
    });
    // eslint-disable-next-line
  }, []);

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

    const formData = new FormData();
    formData.append("image", userImage);
    formData.append("user", JSON.stringify(user));

    updateUser(formData, params.id).then((data) => {
      if (data.error) {
        setUser({ ...user, error: data.error });
      } else {
        navigate(`/admin-user-dashboard/${userInfo.id}`);
        toast.success("User updated successfully !");
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
        Edit User
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
              label="First Name *"
              type="text"
              value={user.firstName}
              sx={{ width: 300, margin: "1rem" }}
              onChange={handleValuesChange("firstName")}
            />
            <br />
            <TextField
              id="lastName"
              label="Last Name *"
              type="text"
              value={user.lastName}
              sx={{ width: 300, margin: "1rem" }}
              onChange={handleValuesChange("lastName")}
            />
            <br />
            <TextField
              id="email"
              label="Email *"
              type="email"
              value={user.email}
              sx={{ width: 300, margin: "1rem" }}
              onChange={handleValuesChange("email")}
            />
            <br />
            <TextField
              id="Password"
              label="Password *"
              type="password"
              value={user.newPassword}
              sx={{ width: 300, margin: "1rem" }}
              onChange={handleValuesChange("password")}
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
              sx={{ mt: 3, width: 300, margin: "1rem" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminEditUser;
