const getClientIp = (req) => {
  if (!req) {
    console.warn("Request object is undefined");
    return null;
  }

  const forwarded = req.headers?.["x-forwarded-for"]?.split(",")[0];
  const socketIp = req.socket?.remoteAddress;
  const ip = req.ip;

  return forwarded || socketIp || ip || null;
};

module.exports = { getClientIp };