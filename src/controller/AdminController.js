const adminService = require("../services/AdminService");

exports.getLockedAccounts = async (req, res) => {
  try {
    const users = await adminService.getLockedAccounts();

    res.json(users);
  } catch (err) {
    console.error("GET LOCKED ACCOUNTS ERROR:", err);

    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.unlockUserAccount = async (req, res) => {
  try {
    const userId = req.params.userId;
    await adminService.unlockUserAccount(userId);

    res.json({ message: "User account unlocked successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to unlock user",
    });
  }
};
