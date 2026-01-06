const jwt = require("jsonwebtoken");
const { Login } = require("../../models");
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

    if (!loginSession) {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }
    // if (loginSession.ip_address !== requestIp) {
    //   loginSession.is_active = false;
    //   await loginSession.save();
    //   return res
    //     .status(403)
    //     .json({ message: "IP changed. Please login again." });
    // }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      loginId: loginSession.id,
    };
    
    if (req.user.role !== "A") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
