// import { Routes, Route } from "react-router-dom";

// import Header from "./components/core/Header";
// import Footer from "./components/core/Footer";
// import Login from "./components/user/Login";
// import Register from "./components/user/Register";
// import Locked from "./components/learning/Locked";
// import Dashboard from "./components/learning/Dashboard";
// import AddCourse from "./components/learning/AddCourse";
// import EditCourse from "./components/learning/EditCourse";
// import Courses from "./components/learning/Courses";
// import EditProfile from "./components/learning/EditProfile";
// import MentorDashboard from "./components/learning/MentorDashboard";
// // import AdminCourseDashboard from './AdminCourseDashboard'
// // import AdminUserDashboard from './AdminUserDashboard'
// import AdminEditUser from "./components/learning/AdminEditUser";
// import AdminDashboard from "./components/learning/AdminDashboard";
// import AdminAddUser from "./components/learning/AdminAddUser";
// import AdminAddCourse from "./components/learning/AdminAddCourse";
// import AdminEditCourse from "./components/learning/AdminEditCourse";
// import SideBar from "./components/learning/SideBar";

// const MainRouter = () => {
//   return (
//     <>
//       <Header />
//       <SideBar/>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/locked" element={<Locked />} />
//         <Route path="/add-course" element={<AddCourse />} />
//         <Route path="/edit-course/:id" element={<EditCourse />} />
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/edit-profile/:id" element={<EditProfile />} />
//         <Route path="/mentor-dashboard/:id" element={<MentorDashboard />} />
//         {/* <Route path='/admin-course-dashboard/:id' element={<AdminCourseDashboard />} />
//         <Route path='/admin-user-dashboard/:id' element={<AdminUserDashboard />} /> */}
//         <Route path="/admin-edit-user/:id" element={<AdminEditUser />} />
//         <Route path="/admin-dashboard/:id" element={<AdminDashboard />} />
//         <Route path="/admin-add-user" element={<AdminAddUser />} />
//         <Route path="/admin-add-course" element={<AdminAddCourse />} />
//         <Route path="/admin-edit-course/:id" element={<AdminEditCourse />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// };

// export default MainRouter;

import { Routes, Route } from "react-router-dom";

import Header from "./components/core/Header";
import Footer from "./components/core/Footer";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Locked from "./components/learning/Locked";
import Dashboard from "./components/learning/Dashboard";
import AddCourse from "./components/learning/AddCourse";
import EditCourse from "./components/learning/EditCourse";
import Courses from "./components/learning/Courses";
import EditProfile from "./components/learning/EditProfile";
import MentorDashboard from "./components/learning/MentorDashboard";
import AdminEditUser from "./components/learning/AdminEditUser";
import AdminDashboard from "./components/learning/AdminDashboard";
import AdminAddUser from "./components/learning/AdminAddUser";
import AdminAddCourse from "./components/learning/AdminAddCourse";
import AdminEditCourse from "./components/learning/AdminEditCourse";

const MainRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/locked" element={<Locked />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/mentor-dashboard/:id" element={<MentorDashboard />} />
        <Route path="/admin-edit-user/:id" element={<AdminEditUser />} />
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />} />
        <Route path="/admin-add-user" element={<AdminAddUser />} />
        <Route path="/admin-add-course" element={<AdminAddCourse />} />
        <Route path="/admin-edit-course/:id" element={<AdminEditCourse />} />
      </Routes>
      <Footer />
    </>
  );
};

export default MainRouter;
