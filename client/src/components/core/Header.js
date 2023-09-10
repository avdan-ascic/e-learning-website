import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import { ScreenWidthContext, UserContext } from "../../App";
import Logo from "../../assets/images/logo.png";
import { logout } from "../../api/user-api";

const Header = () => {
  const { screenWidth } = useContext(ScreenWidthContext);
  const { loggedIn, userInfo, setLoggedIn, setUserInfo, setUserImage } =
    useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        setLoggedIn(false);
        setUserInfo({});
        setUserImage();
        toast.success("See you soon !");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  const handleLogoutMobile = () => {
    handleCloseMenu();
    handleLogout();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#204e59" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {!loggedIn ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <img src={Logo} height={36} width={"auto"} alt="Logo" />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  objectFit: "contain",
                  maxHeight: "36px",
                  width: "auto",
                }}
              />
              {!userInfo.active ? (
                <Button onClick={handleLogout} sx={{ color: "#fff" }}>
                  <LogoutIcon sx={{ marginRight: "0.5em" }} /> Logout
                </Button>
              ) : screenWidth > 980 ? (
                <Box>
                  {userInfo.role === "student" && (
                    <>
                      <Button component={Link} to="/" sx={{ color: "#fff" }}>
                        <HomeIcon sx={{ marginRight: "0.5em" }} />
                        Dashboard
                      </Button>

                      <Button
                        component={Link}
                        to="/courses"
                        sx={{ color: "#fff" }}
                      >
                        <SearchIcon sx={{ marginRight: "0.5em" }} />
                        Search Courses
                      </Button>

                      <Button
                        sx={{ color: "#fff" }}
                        component={Link}
                        to={`/edit-profile/${userInfo.id}`}
                      >
                        <SettingsIcon sx={{ marginRight: "0.5em" }} />
                        Edit Profile
                      </Button>

                      <Button onClick={handleLogout} sx={{ color: "#fff" }}>
                        <LogoutIcon sx={{ marginRight: "0.5em" }} /> Logout
                      </Button>
                    </>
                  )}
                  {userInfo.role === "mentor" && (
                    <>
                      <Button
                        component={Link}
                        to={`/mentor-dashboard/${userInfo.id}`}
                        sx={{ color: "#fff" }}
                      >
                        <HomeIcon sx={{ marginRight: "0.5em" }} />
                        Mentor Dashboard
                      </Button>

                      <Button
                        component={Link}
                        to="/courses"
                        sx={{ color: "#fff" }}
                      >
                        <SearchIcon sx={{ marginRight: "0.5em" }} />
                        Search Courses
                      </Button>

                      <Button
                        component={Link}
                        to={`/edit-profile/${userInfo.id}`}
                        sx={{ color: "#fff" }}
                      >
                        <SettingsIcon sx={{ marginRight: "0.5em" }} />
                        Edit Profile
                      </Button>

                      <Button onClick={handleLogout} sx={{ color: "#fff" }}>
                        <LogoutIcon sx={{ marginRight: "0.5em" }} /> Logout
                      </Button>
                    </>
                  )}
                  {userInfo.role === "admin" && (
                    <>
                      <Button
                        component={Link}
                        to={`/admin-dashboard/${userInfo.id}`}
                        sx={{ color: "#fff" }}
                      >
                        <HomeIcon sx={{ marginRight: "0.5em" }} />
                        Admin Dashboard
                      </Button>

                      <Button
                        component={Link}
                        to="/courses"
                        sx={{ color: "#fff" }}
                      >
                        <SearchIcon sx={{ marginRight: "0.5em" }} />
                        Search Courses
                      </Button>

                      <Button
                        component={Link}
                        to={`/edit-profile/${userInfo.id}`}
                        sx={{ color: "#fff" }}
                      >
                        <SettingsIcon sx={{ marginRight: "0.5em" }} />
                        Edit Profile
                      </Button>

                      <Button onClick={handleLogout} sx={{ color: "#fff" }}>
                        <LogoutIcon sx={{ marginRight: "0.5em" }} /> Logout
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                <>
                  <Tooltip title="open settings">
                    <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                      <MenuIcon fontSize="large" sx={{ color: "#fff" }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseMenu}
                  >
                    {userInfo.role !== "student" && (
                      <MenuItem
                        onClick={handleCloseMenu}
                        component={Link}
                        to={
                          userInfo.role === "mentor"
                            ? `/mentor-dashboard/${userInfo.id}`
                            : `/admin-dashboard/${userInfo.id}`
                        }
                      >
                        <Typography textAlign="center">
                          {userInfo.role === "mentor" ? "Mentor " : "Admin "}
                          Dashboard
                        </Typography>
                      </MenuItem>
                    )}
                    {userInfo.role === "student" && (
                      <MenuItem
                        onClick={handleCloseMenu}
                        component={Link}
                        to="/"
                      >
                        <Typography textAlign="center">Dashboard</Typography>
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={handleCloseMenu}
                      component={Link}
                      to="/courses"
                    >
                      <Typography textAlign="center">Search Courses</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseMenu}
                      component={Link}
                      to={`/edit-profile/${userInfo.id}`}
                    >
                      <Typography textAlign="center">Edit Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogoutMobile}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
