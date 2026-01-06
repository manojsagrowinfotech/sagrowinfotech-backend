const authRoutes = require("../routes/AuthRoutes");
const adminRoutes = require("../routes/AdminRoutes");
const userRoutes = require("../routes/UserRoutes");
const studentRoutes = require("../routes/StudentRoutes");
const excelRoutes = require("../routes/ExcelRoutes");

module.exports = {
  auth: authRoutes,
  admin: adminRoutes,
  user: userRoutes,
  student: studentRoutes,
  excel: excelRoutes,
};
