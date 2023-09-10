import User from "../models/user.model";

const setActive = async (req, res, next) => {
  try {
    const id = req.body.userId;
    const status = req.body.status;
    let user = await User.findById(id);

    user.active = status;

    await user.save();
    return res
      .status(200)
      .json({ message: "User status updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const setMentor = async (req, res, next) => {
  try {
    const id = req.body.userId;
    const role = req.body.role;
    let user = await User.findById(id);

    user.role = role;

    await user.save();
    return res
      .status(200)
      .json({ message: "User status updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select(
      "firstName lastName email image role active"
    );

    return res.status(200).json({ users: users });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const readUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).select(
      "firstName lastName email image active role"
    );

    return res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) return res.status(400).json({ error: "User not found!" });

    const userUpdate = JSON.parse(req.body.user);
    user.firstName = userUpdate.firstName;
    user.lastName = userUpdate.lastName;
    user.email = userUpdate.email;
    if (userUpdate.password) {
      user.password = userUpdate.password;
    } else {
      user.password = user.password;
    }
    user.active = userUpdate.active;
    user.role = userUpdate.role;
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

export default { setActive, setMentor, readUsers, readUserById, updateUser };
