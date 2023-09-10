import { useState, useEffect, useContext } from "react";
import { Box, Typography, IconButton, Stack, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { UserContext } from "../../App";
import { readAll } from "../../api/course-api";
import { remove } from "../../api/course-api";

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const columns = [
    {
      field: "courseTitle",
      headerName: "Title",
      width: 150,
    },
    {
      field: "mentorName",
      headerName: "Mentor",
      width: 200,
    },
    {
      field: "level",
      headerName: "Level",
      width: 150,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 150,
    },
    {
      field: "Edit",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        return (
          <IconButton
            onClick={() => navigate(`/admin-edit-course/${cellValues.id}`)}
          >
            <EditIcon color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Delete",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        return (
          <IconButton onClick={() => handleDeleteCourse(cellValues.id)}>
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    readAll()
      .then((data) => {
        setCourses(data.courses);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    let tempArray = [];
    if (courses.length > 0) {
      courses.map((course) => {
        return tempArray.push({
          id: course._id,
          courseTitle: course.title,
          mentorName: course.mentorId
            .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
            .join(", "),
          level: course.level,
          duration: course.duration,
        });
      });
    }
    setRows(tempArray);
    // eslint-disable-next-line
  }, [courses]);

  const handleDeleteCourse = (id) => {
    remove(id).then((data) => {
      if (data?.message === "Course soft deleted.") {
        let tempRows = [...rows];
        tempRows[tempRows.findIndex((row) => row.id === id)].mentorName = [];
        setRows(tempRows);
        return;
      }
      setRows(rows.filter((row) => row.id !== id));
    });
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Stack
        sx={{
          width: 800,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h4" textAlign={"center"} sx={{ color: "#204e59" }}>
          Courses
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin-add-course")}
          sx={{
            backgroundColor: "#204e59",
            "&:hover": {
              backgroundColor: "#154043",
            },
          }}
        >
          Add Course
        </Button>
      </Stack>
      <Box
        sx={{
          width: "795px",
          maxWidth: "100%",
          marginTop: "3rem",
          marginBottom: "5rem",
          overflowY: "auto",
        }}
      >
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
      </Box>
    </Box>
  );
};

export default CourseDashboard;
