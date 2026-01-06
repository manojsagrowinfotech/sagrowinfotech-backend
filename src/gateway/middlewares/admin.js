const ROLES_MODULE = require("../../enums/Roles");

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES_MODULE.ROLES.ADMIN.CODE) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
