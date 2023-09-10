import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: "Title is required!",
    maxLength: [55, "Title must not exceed 55 characters!"],
  },
  description: {
    type: String,
    required: "Description is required",
    maxLength: [220, "Title must not exceed 220 characters!"],
  },
  level: {
    type: String,
    required: "Level is required!",
    enum: [
      "Beginner Level",
      "Intermediate Level",
      "Advanced Level",
      "All Levels",
    ],
  },
  duration: {
    type: String,
    required: "Duration is required!",
    enum: [
      "0 - 3 Hours",
      "3 - 6 Hours",
      "6 - 12 Hours",
      "1 - 2 Days",
      "2 - 5 Days",
      "5 - 15 Days",
    ],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  mentorId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  isUnavailable: {
    type: Boolean,
    default: false,
  },
});

courseSchema.pre("save", function (next) {
  if (this.mentorId.length === 0) this.isUnavailable = true;
  else this.isUnavailable = false;

  next();
});

export default mongoose.model("course", courseSchema);
