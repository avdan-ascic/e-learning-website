import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CardContent,
  Button,
  Card,
  CardActions,
  TextField,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { create, isAuthenticated } from "../../api/user-api";

const Register = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
    error: "",
    redirect: false,
  });
  const [userImage, setUserImage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated()
      .then((data) => {
        if (data.user) {
          if (data.user.active) return navigate("/");
          if (!data.user.active) return navigate("/locked");
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleImageChange = (event) => {
    setUserImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (values.password !== values.rePassword) {
      setValues({ ...values, error: "Passwords do not match." });
      return false;
    }

    if (!values.firstName) {
      setValues({
        ...values,
        error: "Please enter First Name!",
        redirect: false,
      });
      return false;
    }

    if (!values.lastName) {
      setValues({
        ...values,
        error: "Please enter Last Name !",
        redirect: false,
      });
      return false;
    }

    if (!values.email) {
      setValues({
        ...values,
        error: "Please enter Email !",
        redirect: false,
      });
      return false;
    }

    if (!values.password) {
      setValues({
        ...values,
        error: "Password is required!",
        redirect: false,
      });
      return false;
    }

    if (!values.rePassword) {
      setValues({
        ...values,
        error: "Please Confirm password !",
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

    const formData = new FormData();
    formData.append("image", userImage);
    formData.append("user", JSON.stringify(values));

    create(formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, redirect: false });
        } else {
          setValues({ ...values, error: "", redirect: true });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      toast.success("User registered successfully.");
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <>
      <Box sx={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <Card sx={{ margin: "0 auto", maxWidth: 500, textAlign: "center" }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{ padding: "1em 0", color: "#204e59" }}
            >
              SIGN UP
            </Typography>
            <TextField
              id="firstName"
              label="First Name *"
              type="text"
              value={values.firstName}
              onChange={handleChange("firstName")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="lastName"
              label="Last Name *"
              type="text"
              value={values.lastName}
              onChange={handleChange("lastName")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="email"
              label="Email *"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="password"
              label="Password *"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />
            <TextField
              id="rePassword"
              label="Confirm Password *"
              type="password"
              value={values.rePassword}
              onChange={handleChange("rePassword")}
              sx={{ margin: "1rem", width: 300 }}
            />
            <br />

            <TextField
              type="file"
              sx={{ margin: "1rem", width: 300 }}
              onChange={handleImageChange}
            />

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
                sx={{
                  backgroundColor: "#204e59",
                  "&:hover": {
                    backgroundColor: "#154043",
                  },
                }}
                onClick={handleSubmit}
              >
                SIGN UP
              </Button>
            </Stack>
          </CardActions>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1em",
              paddingBottom: "1em",
              gap: 3,
            }}
          >
            <Typography
              component="p"
              sx={{
                textAlign: "center",
                fontSize: "1.3em",
              }}
            >
              Already have an account?
            </Typography>
            <Link to="/login">
              <Button sx={{ fontSize: "1.1em" }}>Login</Button>
            </Link>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Register;
