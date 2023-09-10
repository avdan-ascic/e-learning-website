import express from "express";
import passport from "passport";

import studentCtrl from "../controllers/student.controller";

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(200).json({ message: "Unauthorized!" });
    req.user = user;
    return next();
  })(req, res, next);
};

const router = express.Router();

router
  .route("/api/enroll/create/:courseId")
  .post(authMiddleware, studentCtrl.create);
router
  .route("/api/enroll/remove/:courseId")
  .post(authMiddleware, studentCtrl.remove);
router
  .route("/api/enroll/update/:courseId")
  .put(authMiddleware, studentCtrl.update);
router
  .route("/api/enroll/read-by-student/:studentId")
  .get(authMiddleware, studentCtrl.readByStudent);

export default router;
