const UpdateProfileRequest = require("../request/UpdateProfileRequest");
const ProfileResponse = require("../response/ProfileResponse");
const userService = require("../services/UserService");

exports.getProfile = async (req, res) => {
  try {
    const { emailId } = req.params;

    const user = await userService.getProfile(emailId);

    res.json(ProfileResponse.fromEntity(user));
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to retrieve profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const request = new UpdateProfileRequest(req.body);
    request.validate();

    const user = await userService.updateProfile(req.user.userId, request);

    res.json({
      message: "Profile updated successfully"
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to update profile",
    });
  }
};
