import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Box,
  Typography,
  Stack,
  CardContent,
  Card,
  TextField,
  CardActions,
  Button,
} from "@mui/material";
import { isAuthenticated, login } from "../../api/user-api";
import { UserContext } from "../../App";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });
  const { setLoggedIn, setUserInfo, setUserImage, userInfo } =
    useContext(UserContext);
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

  const handleSubmit = () => {
    login(values)
      .then((data) => {
        if (data.error) {
          return setValues({
            ...values,
            redirect: false,
            error: data.error,
          });
        } else {
          setValues({ ...values, redirect: true, error: "" });
          setLoggedIn(true);
          setUserInfo({
            role: data.user.role,
            active: data.user.active,
            id: data.user.id,
          });
          setUserImage(data.user.image);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      if (!userInfo.active) return navigate("/locked");
      else {
        if (userInfo.role === "student") return navigate("/");
        else if (userInfo.role === "mentor")
          return navigate(`/mentor-dashboard/${userInfo.id}`);
        else return navigate(`/admin-dashboard/${userInfo.id}`);
      }
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <Box sx={{ marginTop: "5rem" }}>
      <Card sx={{ margin: "0 auto", maxWidth: 500, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" sx={{ padding: "1em 0", color: "#204e59" }}>
            Login
          </Typography>
          <TextField
            id="email"
            label="email *"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />
          <TextField
            id="password"
            label="password *"
            type="password"
            value={values.password}
            onChange={handleChange("password")}
            sx={{ margin: "1rem", width: 300 }}
          />
          <br />

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
              Login
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
            No account?
          </Typography>
          <Link to="/register">
            <Button sx={{ fontSize: "1.1em" }}>SIGN UP</Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
