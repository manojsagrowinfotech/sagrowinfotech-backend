const Joi = require("joi");
const { STATE_KEYS } = require("../enums/States");
const { ROLE_KEYS } = require("../enums/Roles");

exports.registerSchema = Joi.object({
  emailId: Joi.string().email().max(100).required(),

  password: Joi.string().min(6).max(50).required(),

  fullName: Joi.string().max(100).required(),

  mobileNo: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  role: Joi.string()
    .uppercase()
    .valid(...ROLE_KEYS)
    .required()
    .messages({
      "any.only": `Invalid Role. Must be one of: ${ROLE_KEYS.join(", ")}`,
    }),
  state: Joi.string()
    .uppercase()
    .valid(...STATE_KEYS)
    .required()
    .messages({
      "any.only": `Invalid state. Must be one of: ${STATE_KEYS.join(", ")}`,
    }),
});

exports.loginSchema = Joi.object({
  emailId: Joi.string().email().max(100).required(),
  password: Joi.string().required(),
});

exports.refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
