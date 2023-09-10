import express from "express";
import passport from "passport";
import multer from "multer";

import userCtrl from "../controllers/user.controller";

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(200).json({ message: "Unauthorized!" });
    req.user = user;
    return next();
  })(req, res, next);
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/api/users/create").post(upload.single("image"), userCtrl.create);
router.route("/api/users/login").post(userCtrl.login);
router.route("/api/users/logout").get(authMiddleware, userCtrl.logout);
router
  .route("/api/users/is-authenticated")
  .get(authMiddleware, userCtrl.isAuthenticated);
router
  .route("/api/users/update-info/:id")
  .put(authMiddleware, upload.single("image"), userCtrl.updateInfo);
router
  .route("/api/users/update-password/:id")
  .put(authMiddleware, userCtrl.updatePassword);
router.route("/api/users/delete/:id").delete(authMiddleware, userCtrl.remove);
router
  .route("/api/users/delete-with-password/:id")
  .post(authMiddleware, userCtrl.removeWithPassword);
router.route("/api/users/:id").get(authMiddleware, userCtrl.readName);

export default router;
