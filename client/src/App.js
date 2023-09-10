import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import { isAuthenticated } from "./api/user-api";
import MainRouter from "./MainRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ScreenWidthContext = createContext(window.innerWidth);
export const UserContext = createContext(null);

axios.defaults.withCredentials = true;

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userImage, setUserImage] = useState();

  window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

  useEffect(() => {
    isAuthenticated().then((data) => {
      if (data.user) {
        setLoggedIn(true);
        setUserInfo({
          active: data.user.active,
          role: data.user.role,
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
        setUserImage(data.user.image);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <ScreenWidthContext.Provider value={{ screenWidth }}>
      <UserContext.Provider
        value={{
          loggedIn,
          setLoggedIn,
          userInfo,
          setUserInfo,
          userImage,
          setUserImage,
        }}
      >
        <BrowserRouter>
          <ToastContainer position="bottom-left" />
          <MainRouter />
        </BrowserRouter>
      </UserContext.Provider>
    </ScreenWidthContext.Provider>
  );
}

export default App;
