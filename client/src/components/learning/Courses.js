import { useState, useEffect, useContext } from "react";

import {
  Container,
  Box,
  Drawer,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  Button,
  InputAdornment,
  Collapse,
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CourseCard from "./CourseCard";
import { levels, durations } from "../../helpers/filters";
import { ScreenWidthContext } from "../../App";
import {
  readAll,
  readByName,
  readByAttribute,
  readByAttributeAndName,
} from "../../api/course-api";

const itemsPerPage = 12;

const Courses = () => {
  const { screenWidth } = useContext(ScreenWidthContext);
  const [courses, setCourses] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sendReq, setSendReq] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [levelsChecked, setLevelsChecked] = useState(
    levels.map((lvl) => {
      return { level: lvl, checked: false };
    })
  );
  const [durationsChecked, setDurationsChecked] = useState(
    durations.map((dur) => {
      return { duration: dur, checked: false };
    })
  );
  const [showLevels, setShowLevels] = useState(false);
  const [showDurations, setShowDurations] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const coursesToDisplay = courses.slice(startIndex, endIndex);

    setDisplayedCourses(coursesToDisplay);
  }, [courses, currentPage]);

  useEffect(() => {
    readAll()
      .then((data) => {
        setCourses(data.courses);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleSearch = () => {
    setSendReq(true);
  };
  const handleSearchEnter = (event) => {
    if (event.key === "Enter") setSendReq(true);
  };

  const handleLevelsUpdate = (index) => {
    let tempLevels = [...levelsChecked];
    tempLevels[index].checked = !tempLevels[index].checked;

    if (tempLevels[index].checked) {
      setSelectedLevels([...selectedLevels, tempLevels[index].level]);
    } else {
      setSelectedLevels(
        selectedLevels.filter((lvl) => lvl !== tempLevels[index].level)
      );
    }

    setLevelsChecked(tempLevels);
    setSendReq(true);
  };
  const handleDurationsUpdate = (index) => {
    let tempDurations = [...durationsChecked];
    tempDurations[index].checked = !tempDurations[index].checked;

    if (tempDurations[index].checked) {
      setSelectedDurations([
        ...selectedDurations,
        tempDurations[index].duration,
      ]);
    } else {
      setSelectedDurations(
        selectedDurations.filter((dur) => dur !== tempDurations[index].duration)
      );
    }

    setDurationsChecked(tempDurations);
    setSendReq(true);
  };

  useEffect(() => {
    if (!sendReq) return;

    const searchParams = {
      levels: selectedLevels,
      durations: selectedDurations,
      name: search,
    };

    const apiCalls = [];

    if (
      selectedLevels.length === 0 &&
      selectedDurations.length === 0 &&
      search === ""
    ) {
      apiCalls.push(readAll());
    }

    if (search !== "") {
      apiCalls.push(readByName(search));
    }

    if (selectedLevels.length !== 0 || selectedDurations.length !== 0) {
      apiCalls.push(readByAttribute(searchParams));
    }

    if (
      selectedLevels.length !== 0 ||
      selectedDurations.length !== 0 ||
      search !== ""
    ) {
      apiCalls.push(readByAttributeAndName(searchParams));
    }

    Promise.all(apiCalls)
      .then((results) => {
        const allCourses = results.flatMap((data) => data.courses);
        setCourses(allCourses);
      })
      .catch((err) => console.log(err));

    setSendReq(false);
    // eslint-disable-next-line
  }, [sendReq]);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;

    setDrawerOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ marginBottom: "5rem" }}>
      <Grid container sx={{ marginTop: "3rem", heigth: "91vh" }} spacing={2}>
        <Grid item xs={1} md={3}>
          {screenWidth > 899 ? (
            <>
              <Typography textAlign="center" variant="h4">
                Courses
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography textAlign="flex-start" variant="h4">
                Filter:
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5">
                Level:
                <IconButton onClick={() => setShowLevels(!showLevels)}>
                  <ExpandMoreIcon />
                </IconButton>
              </Typography>
              <Collapse in={showLevels}>
                {levelsChecked.length > 0 && (
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {levels.map((lvl, index) => {
                      const labelId = `levels-list-${index}`;

                      return (
                        <ListItem key={index} sx={{ padding: 0 }}>
                          <ListItemButton
                            role={undefined}
                            onClick={() => handleLevelsUpdate(index)}
                            dense
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={levelsChecked[index].checked}
                                disableRipple
                                inputProps={{ "aria-labelledby": "labelId" }}
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={lvl} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Collapse>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h5">
                Courses Duration:
                <IconButton onClick={() => setShowDurations(!showDurations)}>
                  <ExpandMoreIcon />
                </IconButton>
              </Typography>
              <Collapse in={showDurations}>
                {durationsChecked.length > 0 && (
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {durations.map((dur, index) => {
                      const labelId = `durations-list-${index}`;

                      return (
                        <ListItem key={index} sx={{ padding: 0 }}>
                          <ListItemButton
                            role={undefined}
                            onClick={() => handleDurationsUpdate(index)}
                            dense
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={durationsChecked[index].checked}
                                disableRipple
                                inputProps={{ "aria-labelledby": "labelId" }}
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={dur} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Collapse>

              {screenWidth < 899 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        backgroundColor: "#204e59",
                        "&:hover": {
                          backgroundColor: "#154043",
                        },
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <IconButton onClick={toggleDrawer}>
                <MenuIcon sx={{ color: "#000", pt: 2 }} />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{ width: 300, padding: "1rem" }}
                  role="presentation"
                  onKeyDown={() => setDrawerOpen(false)}
                >
                  {
                    <>
                      <Typography textAlign="center" variant="h4">
                        Courses
                      </Typography>
                      <Divider sx={{ my: 3 }} />
                      <Typography textAlign="flex-start" variant="h4">
                        Filter
                      </Typography>
                      <Divider sx={{ my: 3 }} />

                      <Typography variant="h5">
                        Level:
                        <IconButton onClick={() => setShowLevels(!showLevels)}>
                          <ExpandMoreIcon />
                        </IconButton>
                      </Typography>
                      <Collapse in={showLevels}>
                        {levelsChecked.length > 0 && (
                          <List
                            sx={{ width: "100%", bgcolor: "background.paper" }}
                          >
                            {levels.map((lvl, index) => {
                              const labelId = `levels-list-${index}`;

                              return (
                                <ListItem key={index} sx={{ padding: 0 }}>
                                  <ListItemButton
                                    role={undefined}
                                    onClick={() => handleLevelsUpdate(index)}
                                    dense
                                  >
                                    <ListItemIcon>
                                      <Checkbox
                                        edge="start"
                                        checked={levelsChecked[index].checked}
                                        disableRipple
                                        inputProps={{
                                          "aria-labelledby": "labelId",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={lvl} />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        )}
                      </Collapse>

                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h5">
                        Courses Duration:
                        <IconButton
                          onClick={() => setShowDurations(!showDurations)}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </Typography>
                      <Collapse in={showDurations}>
                        {durationsChecked.length > 0 && (
                          <List
                            sx={{ width: "100%", bgcolor: "background.paper" }}
                          >
                            {durations.map((dur, index) => {
                              const labelId = `durations-list-${index}`;

                              return (
                                <ListItem key={index} sx={{ padding: 0 }}>
                                  <ListItemButton
                                    role={undefined}
                                    onClick={() => handleDurationsUpdate(index)}
                                    dense
                                  >
                                    <ListItemIcon>
                                      <Checkbox
                                        edge="start"
                                        checked={
                                          durationsChecked[index].checked
                                        }
                                        disableRipple
                                        inputProps={{
                                          "aria-labelledby": "labelId",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={dur} />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        )}
                      </Collapse>

                      {screenWidth < 899 && (
                        <>
                          <Divider sx={{ my: 3 }} />
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Button
                              variant="contained"
                              onClick={() => setDrawerOpen(false)}
                              sx={{
                                backgroundColor: "#204e59",
                                "&:hover": {
                                  backgroundColor: "#154043",
                                },
                              }}
                            >
                              Close
                            </Button>
                          </Box>
                        </>
                      )}
                    </>
                  }
                </Box>
              </Drawer>
            </>
          )}
        </Grid>
        <Grid item xs={11} md={9}>
          {screenWidth < 500 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="search-input">Search</InputLabel>
                <OutlinedInput
                  id="search-input"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Search"
                        onClick={handleSearch}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Search"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchEnter}
                />
              </FormControl>
              {displayedCourses.map((course, index) => (
                <CourseCard key={index} course={course} index={index} />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                justifyContent: "flex-start",
              }}
            >
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="search-input">Search</InputLabel>
                <OutlinedInput
                  id="search-input"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Search"
                        onClick={handleSearch}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Search"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchEnter}
                />
              </FormControl>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                  justifyContent: "flex-start",
                }}
              >
                {displayedCourses.map((course, index) => (
                  <CourseCard key={index} course={course} index={index} />
                ))}
              </Box>
            </Box>
          )}
          {courses.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(courses.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Courses;
