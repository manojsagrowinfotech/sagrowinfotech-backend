const Joi = require("joi");
const { STATE_KEYS } = require("../enums/States");
const { EXPERIENCE_LEVEL_KEYS } = require("../enums/ExperienceLevel");
const { EXPERIENCE_KEYS } = require("../enums/YearsOfExperience");

exports.createStudentSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),

  emailId: Joi.string().email().max(50).required(),

  mobileNo: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  experienceLevel: Joi.string()
    .uppercase()
    .valid(...EXPERIENCE_LEVEL_KEYS)
    .required()
    .messages({
      "any.only": `Invalid Experience. Must be one of: ${EXPERIENCE_LEVEL_KEYS.join(
        ", "
      )}`,
    }),

  yearsOfExperience: Joi.string()
    .valid(...EXPERIENCE_KEYS)
    .when("experienceLevel", {
      is: "EXPERIENCED",
      then: Joi.required().messages({
        "any.required": "Years of experience is required for Experienced",
      }),
      otherwise: Joi.allow(null),
    }),

  state: Joi.string()
    .uppercase()
    .valid(...STATE_KEYS)
    .required()
    .messages({
      "any.only": `Invalid state. Must be one of: ${STATE_KEYS.join(", ")}`,
    }),
});
