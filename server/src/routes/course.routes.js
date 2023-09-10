import express from "express";
import passport from "passport";
import multer from "multer";

import courseCtrl from "../controllers/course.controller";

const authMiddleware = (req, res, next) => {
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

router
  .route("/api/courses/create")
  .post(authMiddleware, upload.single("image"), courseCtrl.create);
router.route("/api/courses/read-all").get(courseCtrl.readAll);
router
  .route("/api/courses/:id")
  .get(courseCtrl.readById)
  .put(authMiddleware, upload.single("image"), courseCtrl.update)
  .delete(authMiddleware, courseCtrl.remove);
router
  .route("/api/courses/filter-attributes/:filter")
  .post(courseCtrl.readByAttributeAndName);
router.route("/api/courses/filter-attributes").post(courseCtrl.readByAttribute);
router.route("/api/courses/name/:filter").get(courseCtrl.readByCourseName);
router.route("/api/courses/mentor/:mentorId").get(courseCtrl.readByMentor);

export default router;
