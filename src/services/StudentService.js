const { Op } = require("sequelize");
const { Student } = require("../models");
const AppError = require("../errors/DomainError");
const { getStateCode, getStateLabel, STATES } = require("../enums/States");
const moment = require("moment");
const {
  getExperienceTypeCode,
  getExperienceTypeLabel,EXPERIENCE_LEVEL,
} = require("../enums/ExperienceLevel");
const {
  getExperienceCode,
  getExperienceLabel,YEARS_OF_EXPERIENCE,
} = require("../enums/YearsOfExperience");

exports.createStudent = async (payload) => {
  const { emailId, mobileNo } = payload;

  const existingStudent = await Student.findOne({
    where: {
      [Op.or]: [{ email_id: emailId }, { mobile_no: mobileNo }],
    },
  });

  if (existingStudent) {
    if (existingStudent.emailId === payload.emailId) {
      throw new AppError("Email ID already exists", 409);
    }

    if (existingStudent.mobileNo === payload.mobileNo) {
      throw new AppError("Mobile number already exists", 409);
    }
  }

  const dbPayload = {
    name: payload.name,
    emailId: emailId,
    mobileNo: mobileNo,
    experienceLevel: getExperienceTypeCode(payload.experienceLevel),
    yearsOfExperience:
      getExperienceTypeCode(payload.experienceLevel) === "E"
        ? getExperienceCode(payload.yearsOfExperience)
        : null,
    state: getStateCode(payload.state),
    createdBy: payload.createdBy,
  };

  return Student.create(dbPayload);
};

exports.listStudents = async (filter) => {
  const where = {};

  if (filter.mobileNo) where.mobile_no = filter.mobileNo;
  if (filter.emailId) where.email_id = { [Op.iLike]: `%${filter.emailId}%` };

  if (filter.fromDate && filter.toDate) {
    const from = moment(filter.fromDate, "YYYY-MM-DD").startOf("day").toDate();
    const to = moment(filter.toDate, "YYYY-MM-DD").endOf("day").toDate();
    where.created_time = { [Op.between]: [from, to] };
  }

  const sortColumnMap = {
    created_time: "created_time",
    name: "name",
    email_id: "email_id",
    mobile_no: "mobile_no",
    state: "state",
  };
  const sortBy = sortColumnMap[filter.sortBy] || "created_time";
  const { rows, count } = await Student.findAndCountAll({
    where,
    limit: filter.limit,
    offset: filter.offset,
    order: [[sortBy, filter.order]],
  });

  const mappedRows = rows.map((student) => ({
    id: student.id,
    name: student.name,
    mobileNo: student.mobileNo,
    emailId: student.emailId,
    experienceLevel: getExperienceTypeLabel(student.experienceLevel),
    yearsOfExperience: student.yearsOfExperience
      ? getExperienceLabel(student.yearsOfExperience)
      : null,
    state: getStateLabel(student.state),
    createdBy: student.createdBy,
    createdTime: student.created_time,
  }));

  return { rows: mappedRows, count };
};

exports.deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) throw new AppError("Student not found", 404);
  await student.destroy();
};

exports.getStates = async () => mapMasterData(STATES);
exports.getExperienceLevels = async () => mapMasterData(EXPERIENCE_LEVEL);
exports.getYearsOfExperience = async () => mapMasterData(YEARS_OF_EXPERIENCE);

const mapMasterData = (obj) =>
  Object.entries(obj).map(([key, value]) => ({
    key,
    code: value.CODE,
    label: value.LABEL
  }));

