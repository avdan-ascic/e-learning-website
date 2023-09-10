import { useState } from "react";

import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import UserDashboard from "./UserDashboard";
import CourseDashboard from "./CourseDashboard";

const AdminDashboard = () => {

  const [currentPage, setCurrentPage] = useState("users");

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h5" sx={{color:"#204e59", marginBottom:"1em"}}>Admin Dashboard</Typography>
        <Box sx={{ width: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="select-page">Dashboard</InputLabel>
            <Select
              labelId="select-page"
              value={currentPage}
              label="Dashboard"
              onChange={(event) => setCurrentPage(event.target.value)}
            >
              <MenuItem value={"users"}>Users</MenuItem>
              <MenuItem value={"courses"}>Courses</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        {currentPage === "users" ? <UserDashboard /> : <CourseDashboard />}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
