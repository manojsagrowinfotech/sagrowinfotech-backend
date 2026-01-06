const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  schema: "sagrow_admin",
});

const User = require("./Users")(sequelize, DataTypes);
const Login = require("./Login")(sequelize, DataTypes);
const Logout = require("./Logout")(sequelize, DataTypes);
const Student = require("./Students")(sequelize, DataTypes);
const ExcelHistory  = require("./ExcelHistory")(sequelize, DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  User,
  Login,
  Logout,
  Student,
  ExcelHistory ,
};
