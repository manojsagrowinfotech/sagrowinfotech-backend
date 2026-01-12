const authService = require("../services/AuthService");
const RegisterUserRequest = require("../request/RegisterUserRequest");
const RegisterUserResponse = require("../response/RegisterUserResponse");
const LoginRequest = require("../request/LoginRequest");
const LoginResponse = require("../response/LoginResponse");
const RefreshTokenRequest = require("../request/RefreshTokenRequest");
const RefreshTokenResponse = require("../response/RefreshTokenResponse");
const ResetPasswordRequest = require("../request/ResetPasswordRequest");
const LogoutRequest = require("../request/LogoutRequest");
const { getClientIp } = require("../utils/getClientIp");

exports.register = async (req, res) => {
  try {
    const request = new RegisterUserRequest(req.body);
    const user = await authService.registerUser(request);

    return res.status(201).json(new RegisterUserResponse(user));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const request = new LoginRequest(req.body);
    request.validate();

    const meta = {
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
    };

    const tokens = await authService.loginUser(request, meta);

    return res.json(new LoginResponse(tokens));
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Login failed",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const request = new RefreshTokenRequest(req.body);
    request.validate();

    const meta = {
      ipAddress: getClientIp(req),
    };

    const tokens = await authService.refreshToken(request, meta);

    return res.json(new RefreshTokenResponse(tokens));
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Token expired or invalid",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const request = new LogoutRequest(req.params);
    request.validate();

    const meta = {
      ipAddress: getClientIp(req),
    };

    const result = await authService.logoutUser(request, meta);

    res.json({
      message: "Logged out successfully",
      sessionsLoggedOut: result.sessionsLoggedOut,
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Logout failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const emailId = req.params.emailId;
    const result = await authService.sendOTP(emailId);

    return res.json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const emailId = req.params.emailId;
    const result = await authService.resendOTP(emailId);

    return res.json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    const result = await authService.verifyOTP(emailId, otp);

    // result contains resetToken
    return res.json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const request = new ResetPasswordRequest(req.body);
    request.validate();

    const result = await authService.resetPassword(
      request.resetToken,
      request.newPassword
    );

    return res.json(result);
  } catch (err) {
    return res
      .status(err.status || 400)
      .json({ message: err.message || "Reset password failed" });
  }
};
