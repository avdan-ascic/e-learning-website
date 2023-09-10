import express from "express";
import passport from "passport";
import multer from "multer";

import adminCtrl from "../controllers/admin.controller";

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(200).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    return next();
  })(req, res, next);
};

const allowMentorMiddleware = (req, res, next) => {
  passport.authenticate("jwt", (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(200).json({ message: "Unauthorized" });
    if (user.role === "student")
      return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    return next();
  })(req, res, next);
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/api/admin/set-active").post(authMiddleware, adminCtrl.setActive);
router.route("/api/admin/set-mentor").post(authMiddleware, adminCtrl.setMentor);
router
  .route("/api/admin/read-users")
  .get(allowMentorMiddleware, adminCtrl.readUsers);
router
  .route("/api/admin/read-user-by-id/:id")
  .get(authMiddleware, adminCtrl.readUserById);
router
  .route("/api/admin/update-user/:id")
  .put(authMiddleware, upload.single("image"), adminCtrl.updateUser);

export default router;
