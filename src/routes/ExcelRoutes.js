const express = require("express");
const router = express.Router();
const ExcelController = require("../controller/ExcelController");
const authMiddleware = require("../gateway/middlewares/auth");

router.get("/download", authMiddleware, ExcelController.downloadExcel);

module.exports = router;
