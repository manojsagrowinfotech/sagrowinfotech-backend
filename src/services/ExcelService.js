const ExcelJS = require("exceljs");
const { User, Student, ExcelHistory } = require("../models"); // adjust import
const { Op } = require("sequelize");
const moment = require("moment");
const { getExperienceTypeLabel } = require("../enums/ExperienceLevel");
const { getExperienceLabel } = require("../enums/YearsOfExperience");
const { getStateLabel } = require("../enums/States");

exports.downloadStudentExcel = async ({ fromDate, toDate, userId }) => {

  const from = moment(fromDate, "YYYY-MM-DD").startOf("day").toDate();
  const to = moment(toDate, "YYYY-MM-DD").endOf("day").toDate();
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  const students = await Student.findAll({
    where: {
      created_time: {
        [Op.between]: [from, to],
      },
    },
    order: [["created_time", "DESC"]],
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Students");

  sheet.columns = [
    { header: "S.No", key: "id", width: 10 },
    { header: "Name", key: "name", width: 30 },
    { header: "Mobile No", key: "mobileNo", width: 15 },
    { header: "Email ID", key: "emailId", width: 30 },
    { header: "Experience Level", key: "experienceLevel", width: 15 },
    { header: "Years of Experience", key: "yearsOfExperience", width: 15 },
    { header: "State", key: "state", width: 20 },
    { header: "Created By", key: "createdBy", width: 15 },
    { header: "Created Time", key: "createdTime", width: 25 },
  ];

  students.forEach((s) => {
    sheet.addRow({
      id: s.id,
      name: s.name,
      mobileNo: s.mobileNo,
      emailId: s.emailId,
      experienceLevel: getExperienceTypeLabel(s.experienceLevel),
      yearsOfExperience: s.yearsOfExperience
        ? getExperienceLabel(s.yearsOfExperience)
        : null,
      state: getStateLabel(s.state),
      createdBy: s.createdBy,
      createdTime: s.created_time,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  await ExcelHistory.create({
    excelSize: buffer.byteLength,
    studentCount: students.length,
    downloadBy: user.emailId,
  });

  return buffer; // return buffer to send as file
};
