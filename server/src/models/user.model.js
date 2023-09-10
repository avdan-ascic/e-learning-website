import mongoose from "mongoose";
import bcrypt from "bcrypt";

const nameRegex = /^[0-9A-Za-z\s]+$/;

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: "First Name is required!",
    maxLength: [30, "First name must not exceed more than 30 characters!"],
    match: [nameRegex, "First name accepts only letters, numbers and spaces!"],
  },
  lastName: {
    type: String,
    trim: true,
    required: "Last Name is required!",
    maxLength: [30, "Last name must not exceed more than 30 characters!"],
    match: [nameRegex, "Last name accepts only letters, numbers and spaces!"],
  },
  email: {
    type: String,
    trim: true,
    required: "Email is required!",
    match: [/.+\@.+\../, "Please enter a valid email address!"],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  numberOfProjects: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: "Password is required!",
  },
  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
  },
  active: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  const userModel = mongoose.model("user", userSchema);

  const checkEmail = await userModel.findOne({ email: this.email });

  if (checkEmail) {
    if (this._id.toString() != checkEmail._id.toString())
      next(new Error("Email is already registered!"));
  }

  if (this.active) {
    const tempUser = await userModel.findById(this._id);
    if (tempUser !== null) {
      if (tempUser.password === this.password) next();
    }
  }

  if (this.password.length < 6)
    next(new Error("Password must contain at least 6 characters!"));

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(new Error(err));
  }
});

export default mongoose.model("user", userSchema);
