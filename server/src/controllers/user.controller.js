import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import StudCourses from "../models/student-course.model";
import Course from "../models/course.model";
import config from "../config";

const create = async (req, res, next) => {
  try {
    let user = new User(JSON.parse(req.body.user));

    if (req.file !== undefined) {
      user.image.data = req.file.buffer;
      user.image.contentType = req.file.mimetype;
    }

    await user.save();
    return res.status(200).json({ message: "User registered successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(400).json({ error: "Email is not registered." });

    const checkPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!checkPassword)
      return res
        .status(400)
        .json({ error: "The password you've entered is incorrect!" });

    req.session.user = user;

    const token = jwt.sign({ id: user._id }, config.jwt_secret);
    res.cookie("token", token, { expire: new Date() + 999, httpOnly: true });

    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        role: user.role,
        active: user.active,
        numberOfProjects: user.numberOfProjects,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readName = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).select("firstName lastName");

    return res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("token");
  res.clearCookie("connect.sid");
  return res.status(200).json({ message: "User logged out successfully. " });
};

const updateInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) return res.status(400).json({ error: "User not found!" });

    const userUpdate = JSON.parse(req.body.user);
    user.firstName = userUpdate.firstName;
    user.lastName = userUpdate.lastName;
    user.email = userUpdate.email;
    user.updated = Date.now();

    if (req.file !== undefined) {
      user.image.data = req.file.buffer;
      user.image.contentType = req.file.mimetype;
    }

    await user.save();
    return res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) return res.status(400).json({ error: "User not found!" });

    const checkPassword = await bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    if (!checkPassword)
      return res
        .status(400)
        .json({ error: "The password you've entered is incorrect!" });

    user.password = req.body.newPassword;

    await user.save();
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const isAuthenticated = (req, res, next) => {
  const user = req.user;
  return res.status(200).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      role: user.role,
      active: user.active,
      numberOfProjects: user.numberOfProjects,
    },
  });
};

const removeWithPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    const checkPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!checkPassword)
      return res
        .status(400)
        .json({ error: "The password you've entered is incorrect!" });

    if (user.role === "student") {
      await User.findByIdAndDelete(id);
      await StudCourses.deleteMany({ studentId: id });
    } else {
      let courses = await Course.find({ mentorId: id });
      for (let crs of courses) {
        let tempMentors = crs.mentorId;
        tempMentors = tempMentors.filter(
          (mentId) => mentId.toString() !== id.toString()
        );
        crs.mentorId = tempMentors;
        if (crs.mentorId.length === 0) {
          const checkEnrolled = await StudCourses.find({ courseId: crs._id });
          if (checkEnrolled.length > 0) await crs.save();
          else await Course.findByIdAndDelete(crs._id);
        } else {
          await crs.save();
        }
      }

      await User.findByIdAndDelete(id);
      await StudCourses.deleteMany({ studentId: id });
    }

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (user.role === "student") {
      await User.findByIdAndDelete(id);
      await StudCourses.deleteMany({ studentId: id });
    } else {
      let courses = await Course.find({ mentorId: id });
      for (let crs of courses) {
        let tempMentors = crs.mentorId;
        tempMentors = tempMentors.filter(
          (mentId) => mentId.toString() !== id.toString()
        );
        crs.mentorId = tempMentors;
        if (crs.mentorId.length === 0) {
          const checkEnrolled = await StudCourses.find({ courseId: crs._id });
          if (checkEnrolled.length > 0) await crs.save();
          else await Course.findByIdAndDelete(crs._id);
        } else {
          await crs.save();
        }
      }

      await User.findByIdAndDelete(id);
      await StudCourses.deleteMany({ studentId: id });
    }

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export default {
  create,
  login,
  logout,
  readName,
  updateInfo,
  updatePassword,
  isAuthenticated,
  removeWithPassword,
  remove,
};
