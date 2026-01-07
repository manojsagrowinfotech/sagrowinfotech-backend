const CreateStudentRequest = require("../request/CreateStudentRequest");
const ListStudentsRequest = require("../request/ListStudentsRequest");
const StudentResponse = require("../response/StudentResponse");
const studentService = require("../services/StudentService");

exports.createStudent = async (req, res) => {
  try {
    const request = new CreateStudentRequest(req.body);

    await studentService.createStudent(request.toPayload());

    res.status(201).json({
      message: "Student created successfully",
    });
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);

    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.listStudents = async (req, res, next) => {
  try {
    const request = new ListStudentsRequest(req.query);
    request.validate();

    const { rows, count } = await studentService.listStudents(request);

    res.json({
      records: rows,
      pagination: {
        totalRecords: count,
        currentPage: request.page,
        totalPages: Math.ceil(count / request.limit),
        limit: request.limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getExperienceLevels = async (req, res, next) => {
  try {
    const experienceLevels = await studentService.getExperienceLevels();
    res.json({ experienceLevels });
  } catch (err) {
    next(err);
  }
};

exports.getYearsOfExperience = async (req, res, next) => {
  try {
    const yearsOfExperience = await studentService.getYearsOfExperience();
    res.json({ yearsOfExperience });
  } catch (err) {
    next(err);
  }
};

exports.getStates = async (req, res, next) => {
  try {
    const states = await studentService.getStates();
    res.json({ states });
  } catch (err) {
    next(err);
  }
};
