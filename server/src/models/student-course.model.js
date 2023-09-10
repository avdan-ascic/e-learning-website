import mongoose from "mongoose";

const studentCourseSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("student_course", studentCourseSchema);
