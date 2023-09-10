import { useState, useEffect, useContext } from "react";

import { Container, Box, Typography, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserContext } from "../../App";
import { readByMentor } from "../../api/course-api";
import { remove } from "../../api/course-api";
import { binaryToBase64 } from "../../helpers/image-format-converter";

const MentorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 250,
      renderCell: (cellValues) => {
        return (
          <img
            src={`data:${
              cellValues.row.image.contentType
            };base64,${binaryToBase64(cellValues.row.image.data.data)}`}
            alt="Course"
            style={{
              maxWidth: 230,
              maxHeight: 200,
              objectFit: "contain",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        );
      },
    },
    {
      field: "courseTitle",
      headerName: "Title",
      width: 150,
    },
    {
      field: "courseDescription",
      headerName: "Description",
      width: 400,
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
          <IconButton onClick={() => navigate(`/edit-course/${cellValues.id}`)}>
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
    if (userInfo?.id) {
      readByMentor(userInfo.id)
        .then((data) => {
          setCourses(data.courses);
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    let tempArr = [];
    if (courses.length > 0) {
      courses.map((course) => {
        return tempArr.push({
          id: course._id,
          courseTitle: course.title,
          image: course.image,
          courseDescription: course.description,
          level: course.level,
          duration: course.duration,
        });
      });
    }
    setRows(tempArr);
    // eslint-disable-next-line
  }, [courses]);

  const handleDeleteCourse = (id) => {
    remove(id).then(() => {
      setRows(rows.filter((row) => row.id !== id));
    });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          width: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h4" textAlign={"center"}>
          Mentor Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/add-course")}
          sx={{
            backgroundColor: "#204e59",
            "&:hover": {
              backgroundColor: "#154043",
            },
          }}
        >
          Add Course
        </Button>
      </Box>

      <Box
        sx={{
          width: "1245px",
          maxWidth: "100%",
          marginTop: "3rem",
          marginBottom: "5rem",
          overflowY: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowHeight={() => "auto"}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default MentorDashboard;
