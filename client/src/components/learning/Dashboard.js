import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Typography, Box, Pagination, Stack } from "@mui/material";
import { UserContext } from "../../App";
import { isAuthenticated } from "../../api/user-api";
import { readByStudent } from "../../api/enroll-api";
import DashboardCard from "./DashboardCard";

const itemsPerPage = 6;

const Dashboard = () => {
  const { userInfo } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated()
      .then((data) => {
        if (!data.user) return navigate("/login");

        if (!data.user.active) return navigate("/locked");
        if (data.user.role !== "admin") return navigate("/");
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const readCourses = () => {
    readByStudent(userInfo.id)
      .then((data) => {
        setCourses(data.courses);
        let tempCompleted = [];
        let tempInProgress = [];

        for (const course of data.courses) {
          if (course.isCompleted === true) {
            tempCompleted.push(course);
          } else {
            tempInProgress.push(course);
          }
        }

        setCompleted(tempCompleted);
        setInProgress(tempInProgress);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (userInfo?.id) {
      readCourses();
    }
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const coursesToDisplay = courses.slice(startIndex, endIndex);

    setDisplayedCourses(coursesToDisplay);
  }, [courses, currentPage]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
        Your Current Courses and Process
      </Typography>
      <Box
        sx={{
          mt: 5,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Typography sx={{ fontSize: "1.5em" }}>
          In Progress: {`${inProgress.length}`}
        </Typography>
        <Typography sx={{ fontSize: "1.5em" }}>
          Completed: {`${completed.length}`}
        </Typography>
      </Box>
      <Stack sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "flex-start",
            my: 5,
          }}
        >
          {displayedCourses.map((course, index) => (
            <DashboardCard
              key={index}
              course={course.courseId}
              completed={course.isCompleted}
              index={index}
              readCourses={readCourses}
            />
          ))}
        </Box>
        {courses.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 9 }}>
            <Pagination
              count={Math.ceil(courses.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Dashboard;
