import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        backgroundColor: "#204e59",
        py: ".75rem",
        width: "100%",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: "#fff",
        }}
      >
        Powered by Paragon 2023
      </Typography>
    </Box>
  );
};

export default Footer;
