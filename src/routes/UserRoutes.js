const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const authMiddleware = require("../gateway/middlewares/auth");

router.get("/profile/:emailId", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
