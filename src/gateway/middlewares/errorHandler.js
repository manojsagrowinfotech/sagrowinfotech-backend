module.exports = (err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({
      message: "CORS policy blocked this request",
    });
  }

  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json({
    message: err.message || "Internal server error",
  });
};
