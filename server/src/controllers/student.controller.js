import Course from "../models/course.model";
import StudCourses from "../models/student-course.model";
import User from "../models/user.model";

const create = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.body.studentId;

    const checkEnrolled = await StudCourses.findOne({
      courseId: courseId,
      studentId: studentId,
    });
    if (checkEnrolled)
      return res.status(200).json({ message: "Course already added" });

    const studCourse = new StudCourses({
      studentId: studentId,
      courseId: courseId,
    });

    await studCourse.save();
    return res.status(200).json({ message: "Course enrollment successfull." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.body.studentId;

    await StudCourses.findOneAndDelete({
      courseId: courseId,
      studentId: studentId,
    });
    return res
      .status(200)
      .json({ message: "Course disenrollment successfull." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

// isCompleted handler
const update = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.body.studentId;
    const courseStatus = req.body.isCompleted;

    let studCourse = await StudCourses.findOne({
      courseId: courseId,
      studentId: studentId,
    });
    studCourse.isCompleted = courseStatus;

    await studCourse.save();
    return res
      .status(200)
      .json({ message: "Course status updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readByStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    const coursesByStudent = await StudCourses.find({
      studentId: studentId,
    }).populate({
      path: "courseId",
      populate: {
        path: "mentorId",
        select: "firstName lastName",
      },
    });

    return res.status(200).json({ courses: coursesByStudent });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export default { create, remove, update, readByStudent };
