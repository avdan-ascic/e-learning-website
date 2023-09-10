import { Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { isAuthenticated } from "../../api/user-api";

const Locked = () => {
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated()
      .then((data) => {
        if (!data?.user) return navigate("/login");
        if (data.user.active) return navigate("/");
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5rem",
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        E-Learning Website
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "center", marginTop: "2rem" }}
      >
        Your account is waiting for administrator approval.
      </Typography>
    </Box>
  );
};

export default Locked;
