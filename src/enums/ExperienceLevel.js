const EXPERIENCE_LEVEL = Object.freeze({
  FRESHER: { CODE: "F", LABEL: "Fresher" },
  EXPERIENCED: { CODE: "E", LABEL: "Experienced" },
});

const EXPERIENCE_LEVEL_KEYS = Object.keys(EXPERIENCE_LEVEL);

const getExperienceTypeLabel = (code) => {
  const type = Object.values(EXPERIENCE_LEVEL).find((t) => t.CODE === code);
  return type ? type.LABEL : "Unknown";
};

const getExperienceTypeCode = (key) => {
  const type = EXPERIENCE_LEVEL[key?.trim().toUpperCase()];
  return type ? type.CODE : null;
};

module.exports = {
  EXPERIENCE_LEVEL,
  EXPERIENCE_LEVEL_KEYS,
  getExperienceTypeLabel,
  getExperienceTypeCode,
};
