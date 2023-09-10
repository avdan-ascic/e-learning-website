import Course from "../models/course.model";
import StudCourses from "../models/student-course.model";
import User from "../models/user.model";

const create = async (req, res, next) => {
  try {
    let course = new Course(JSON.parse(req.body.course));

    course.image.data = req.file.buffer;
    course.image.contentType = req.file.mimeType;

    if (course.mentorId.length > 0) {
      let user = await User.findById(course.mentorId);
      if (!user.numberOfProjects) {
        Object.assign(user, { numberOfProjects: 1 });
      } else {
        user.numberOfProjects += 1;
      }
      await user.save();
    }

    await course.save();
    return res.status(200).json({ message: "Course saved successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readAll = async (req, res, next) => {
  try {
    const courses = await Course.find({}).populate({
      path: "mentorId",
      select: "firstName lastName",
    });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);

    if (!course) res.status(400).json({ error: "Course not found!" });

    return res.status(200).json({ course: course });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readByAttribute = async (req, res, next) => {
  try {
    const durations = req.body.durations;
    const levels = req.body.levels;

    const courses = await Course.find({
      $or: [{ duration: { $in: durations } }, { level: { $in: levels } }],
    });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readByCourseName = async (req, res, next) => {
  try {
    const title = req.params.filter;
    const courses = await Course.find({
      title: { $regex: title, $options: "i" },
    });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readByAttributeAndName = async (req, res, next) => {
  try {
    const title = req.params.filter;
    const durations = req.body.durations;
    const levels = req.body.levels;

    const courses = await Course.find({
      $and: [
        { title: { $regex: title, $options: "i" } },
        { $or: [{ duration: { $in: durations } }, { level: { $in: levels } }] },
      ],
    });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readByMentor = async (req, res, next) => {
  try {
    const mentorId = req.params.mentorId;
    const courses = await Course.find({ mentorId: mentorId });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    let course = await Course.findById(id);

    const courseUpdate = JSON.parse(req.body.course);
    course.title = courseUpdate.title;
    course.description = courseUpdate.description;
    course.level = courseUpdate.level;
    course.duration = courseUpdate.duration;
    if (courseUpdate.mentorId) {
      course.mentorId = courseUpdate.mentorId;
    }

    if (req.file !== undefined) {
      course.image.data = req.file.buffer;
      course.image.contentType = req.file.mimetype;
    }

    await course.save();
    return res.status(200).json({ message: "Course updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    let course = await Course.findById(id);

    let user = await User.findById(course.mentorId);
    user.numberOfProjects -= 1;

    await user.save();

    const checkEnrolled = await StudCourses.find({ courseId: id });
    if (checkEnrolled.length === 0) {
      await Course.findByIdAndDelete(id);
      await StudCourses.deleteMany({ courseId: id });
    } else {
      return res.status(200).json({ message: "Course soft deleted." });
    }

    return res.status(200).json({ message: "Course removed successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export default {
  create,
  readAll,
  readByAttribute,
  readByCourseName,
  readById,
  readByMentor,
  readByAttributeAndName,
  update,
  remove,
};
