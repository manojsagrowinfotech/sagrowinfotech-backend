const express = require("express");
const router = express.Router();
const studentController = require("../controller/StudentController");
const authMiddleware = require("../gateway/middlewares/auth");
const validate = require("../gateway/middlewares/validate");
const StudentValidator = require("../validators/StudentValidator");

router.post(
  "/create",
  validate(StudentValidator.createStudentSchema),
  studentController.createStudent
);
router.get("/retrive", authMiddleware, studentController.listStudents);
router.delete("/delete/:id", authMiddleware, studentController.deleteStudent);

router.get("/experienceLevel", studentController.getExperienceLevels);
router.get("/yearsOfExperience", studentController.getYearsOfExperience);
router.get("/states", studentController.getStates);

module.exports = router;
