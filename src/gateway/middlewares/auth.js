const jwt = require("jsonwebtoken");
const { Login } = require("../../models");
const { hashToken } = require("../../utils/token");
// const getClientIp = require("../../utils/getClientIp");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const loginSession = await Login.findOne({
      where: {
        user_id: decoded.userId,
        is_active: true,
      },
    });

    if (hashToken(token) !== loginSession.access_token_hash) {
      return res
        .status(401)
        .json({ message: "Token mismatch. Please login again." });
    }

    if (!loginSession || !loginSession.dataValues?.is_active) {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      loginId: loginSession.id,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
