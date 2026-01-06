const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");
const authMiddleware = require("../gateway/middlewares/auth");

router.get(
  "/locked-accounts",
  authMiddleware,
  adminController.getLockedAccounts
);

router.post(
  "/unlock-user/:userId",
  authMiddleware,
  adminController.unlockUserAccount
);

module.exports = router;
