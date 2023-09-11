import { useState, useEffect, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  InputLabel,
  MenuItem,
  TextField,
  Button,
  FormControl,
  Select,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  updateInfo,
  updatePassword,
  removeWithPassword,
} from "../../api/user-api";
import { UserContext } from "../../App";
import { isAuthenticated } from "../../api/user-api";
import { binaryToBase64 } from "../../helpers/image-format-converter";

const EditProfile = () => {
  const [editPage, setEditPage] = useState("Edit Profile");
  const { userInfo, setUserImage, setUserInfo, setLoggedIn } =
    useContext(UserContext);

  const [infoValues, setInfoValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    error: "",
  });
  const [pwValues, setPwValues] = useState({
    currentPassword: "",
    newPassword: "",
    rePassword: "",
    error: "",
  });
  const [remPassword, setRemPassword] = useState({
    password: "",
    error: "",
  });
  const [infoImage, setInfoImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    isAuthenticated()
      .then((data) => {
        if (!data.user) return navigate("/login");
        if (!data.user.active) return navigate("/locked");
        setInfoValues({
          ...infoValues,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
        });
        if (Object.keys(data.user.image).length > 0) {
          setInfoImage(data.user.image);
          setDisplayImage(
            `data:${data.user.image.contentType};base64,${binaryToBase64(
              data.user.image.data.data
            )}`
          );
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  const handleInfoChange = (name) => (event) => {
    setInfoValues({ ...infoValues, [name]: event.target.value });
  };
  const handleImageChange = (event) => {
    setInfoImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDisplayImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitValues = () => {
    if (!infoValues.firstName) {
      setInfoValues({ ...infoValues, error: "Please inser First Name !" });
      return;
    }

    if (!infoValues.lastName) {
      setInfoValues({ ...infoValues, error: " Please insert Last Name !" });
      return;
    }

    if (!infoValues.email) {
      setInfoValues({ ...infoValues, error: "Please insert Email !" });
      return;
    }

    const formData = new FormData();
    formData.append("image", infoImage);
    formData.append("user", JSON.stringify(infoValues));

    updateInfo(formData, userInfo.id)
      .then((data) => {
        if (data.error) {
          setInfoValues({ ...infoValues, error: data.error });
        } else {
          setInfoValues({ ...infoValues, error: "" });
          window.location.reload();
          toast.success("Profile updated successfully");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChangePasswords = (name) => (event) => {
    setPwValues({ ...pwValues, [name]: event.target.value });
  };

  const validateForm = () => {
    if (!pwValues.currentPassword) {
      setPwValues({
        ...pwValues,
        error: "Please insert Current Password !",
      });
      return false;
    }

    if (!pwValues.newPassword) {
      setPwValues({ ...pwValues, error: "Please insert New Password !" });
      return false;
    }

    if (!pwValues.rePassword) {
      setPwValues({
        ...pwValues,
        error: " Please insert Repeat Password !",
      });
      return false;
    }

    if (pwValues.newPassword !== pwValues.rePassword) {
      setPwValues({ ...pwValues, error: "Passwords do not match !" });
      return false;
    }
    return true;
  };

  const handleSubmitPassword = () => {
    if (!validateForm()) {
      return;
    }
    updatePassword(pwValues, userInfo.id)
      .then((data) => {
        if (data.error) {
          setPwValues({ ...pwValues, error: data.error });
        } else {
          setPwValues({
            ...pwValues,
            error: "",
            currentPassword: "",
            newPassword: "",
            rePassword: "",
          });
          setEditPage("Edit Profile");
          toast.success("Password updated successfully!");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRemovePasswordChange = (event) => {
    setRemPassword({ ...remPassword, password: event.target.value });
  };

  const handleRemove = () => {
    if (!remPassword.password)
      return setRemPassword({
        ...remPassword,
        error: "Please enter password !",
      });

    removeWithPassword({ password: remPassword.password }, userInfo.id)
      .then((data) => {
        if (data.error) {
          setRemPassword({
            ...remPassword,
            error: data.error,
          });
          handleClose()
        } else {
          setRemPassword({ ...remPassword, error: "" });
          setLoggedIn(false);
          setUserInfo({});
          setUserImage();
          navigate("/login");
          toast.success("Profile deleted successfully !");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <Typography variant="h5" sx={{ color: "#204e59" }}>
          {editPage}
        </Typography>
        <Box sx={{ width: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="edit-profile-page">Profile</InputLabel>
            <Select
              labelId="edit-profile-page"
              value={editPage}
              label="Edit Profile"
              onChange={(e) => setEditPage(e.target.value)}
            >
              <MenuItem value={"Edit Profile"}>Edit Profile</MenuItem>
              <MenuItem value={"Change Password"}>Change Password</MenuItem>
              <MenuItem value={"Delete Account"}>Delete Account</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {editPage === "Edit Profile" && (
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
                value={infoValues.firstName}
                onChange={handleInfoChange("firstName")}
                sx={{ margin: "1rem", width: 300 }}
              />
              <br />
              <TextField
                id="lastName"
                label="Last Name *"
                type="text"
                value={infoValues.lastName}
                onChange={handleInfoChange("lastName")}
                sx={{ margin: "1rem", width: 300 }}
              />
              <br />
              <TextField
                id="email"
                label="Email *"
                type="email"
                value={infoValues.email}
                onChange={handleInfoChange("email")}
                sx={{ margin: "1rem", width: 300 }}
              />
              <br />

              {infoValues.error && (
                <Typography component="p" color="error">
                  {infoValues.error}
                </Typography>
              )}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSubmitValues}
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
          </Grid>
        </Grid>
      )}

      {editPage === "Change Password" && (
        <Box
          sx={{
            mt: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            id="currentPassword"
            label="Current Password *"
            type="password"
            value={pwValues.currentPassword}
            onChange={handleChangePasswords("currentPassword")}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />
          <TextField
            id="newPassword"
            label="New Password *"
            type="password"
            value={pwValues.newPassword}
            onChange={handleChangePasswords("newPassword")}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />
          <TextField
            id="rePassword"
            label="Repeat Password *"
            type="password"
            value={pwValues.rePassword}
            onChange={handleChangePasswords("rePassword")}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />

          {pwValues.error && (
            <Typography component="p" color="error">
              {pwValues.error}
            </Typography>
          )}

          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              onClick={handleSubmitPassword}
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
        </Box>
      )}

      {editPage === "Delete Account" && (
        <Box
          sx={{
            mt: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            id="password"
            label="Current Password *"
            type="password"
            value={remPassword.password}
            onChange={handleRemovePasswordChange}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />

          {remPassword.error && (
            <Typography component="p" color="error">
              {remPassword.error}
            </Typography>
          )}

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                backgroundColor: "#204e59",
                "&:hover": {
                  backgroundColor: "#154043",
                },
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        DELETE ACCOUNT
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRemove} autoFocus>
           OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProfile;
