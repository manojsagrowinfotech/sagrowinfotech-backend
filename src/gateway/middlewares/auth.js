const jwt = require("jsonwebtoken");
const { Login } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // ✅ Stateless JWT verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Session check only
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

    // // ✅ Validate that the provided token matches the stored access token
    // const tokenMatches = hashToken(token) === loginSession.access_token_hash;
    // if (!tokenMatches) {
    //   return res
    //     .status(401)
    //     .json({ message: "Token mismatch. Please login again." });
    // }

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
