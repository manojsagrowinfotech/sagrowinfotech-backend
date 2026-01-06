const Joi = require("joi");
const { STATE_KEYS } = require("../enums/States");

exports.updateProfileSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  mobileNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  state: Joi.string()
    .uppercase()
    .valid(...STATE_KEYS)
    .required()
    .messages({
      "any.only": `Invalid state. Must be one of: ${STATE_KEYS.join(", ")}`,
    }),
});