const YEARS_OF_EXPERIENCE = Object.freeze({
  ONE_YEAR: { CODE: "1", LABEL: "1 Year" },
  TWO_YEARS: { CODE: "2", LABEL: "2 Years" },
  THREE_YEARS: { CODE: "3", LABEL: "3 Years" },
  FOUR_YEARS: { CODE: "4", LABEL: "4 Years" },
  FIVE_YEARS: { CODE: "5", LABEL: "5 Years" },
  SIX_YEARS: { CODE: "6", LABEL: "6 Years" },
  SEVEN_YEARS: { CODE: "7", LABEL: "7 Years" },
  EIGHT_YEARS: { CODE: "8", LABEL: "8 Years" },
  NINE_YEARS: { CODE: "9", LABEL: "9 Years" },
  TEN_PLUS_YEARS: { CODE: "A", LABEL: "10+ Years" },
});

const EXPERIENCE_KEYS = Object.keys(YEARS_OF_EXPERIENCE);

const getExperienceLabel = (code) => {
  const exp = Object.values(YEARS_OF_EXPERIENCE).find((e) => e.CODE === code);
  return exp ? exp.LABEL : "Unknown";
};

const getExperienceCode = (key) => {
  const exp = YEARS_OF_EXPERIENCE[key?.trim().toUpperCase()];
  return exp ? exp.CODE : null;
};

module.exports = {
  YEARS_OF_EXPERIENCE,
  EXPERIENCE_KEYS,
  getExperienceLabel,
  getExperienceCode,
};
