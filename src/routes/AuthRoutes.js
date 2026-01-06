const express = require("express");
const router = express.Router();
const authController = require("../controller/AuthController");
const validate = require("../gateway/middlewares/validate");
const authValidator = require("../validators/AuthValidator");
const authMiddleware = require("../gateway/middlewares/auth");

router.post(
  "/register",
  authMiddleware,
  validate(authValidator.registerSchema),
  authController.register
);
router.post(
  "/login",
  validate(authValidator.loginSchema),
  authController.login
);
router.post(
  "/refresh-token",
  validate(authValidator.refreshTokenSchema),
  authController.refreshToken
);
router.post("/logout/:emailId", authController.logout);
router.post("/forgot-password/:emailId", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
