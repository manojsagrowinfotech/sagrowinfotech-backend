const STATES = Object.freeze({
  ANDHRA_PRADESH: { CODE: "A", LABEL: "Andhra Pradesh" },
  TELANGANA: { CODE: "T", LABEL: "Telangana" },
  TAMIL_NADU: { CODE: "N", LABEL: "Tamil Nadu" },
  KARNATAKA: { CODE: "K", LABEL: "Karnataka" },
  KERALA: { CODE: "L", LABEL: "Kerala" },
  MAHARASHTRA: { CODE: "M", LABEL: "Maharashtra" },
  GUJARAT: { CODE: "G", LABEL: "Gujarat" },
  RAJASTHAN: { CODE: "R", LABEL: "Rajasthan" },
  UTTAR_PRADESH: { CODE: "U", LABEL: "Uttar Pradesh" },
  MADHYA_PRADESH: { CODE: "D", LABEL: "Madhya Pradesh" },
  WEST_BENGAL: { CODE: "W", LABEL: "West Bengal" },
  ODISHA: { CODE: "O", LABEL: "Odisha" },
  BIHAR: { CODE: "B", LABEL: "Bihar" },
  PUNJAB: { CODE: "P", LABEL: "Punjab" },
  HARYANA: { CODE: "H", LABEL: "Haryana" },
});

const STATE_KEYS = Object.keys(STATES);

const getStateLabel = (code) => {
  const state = Object.values(STATES).find((s) => s.CODE === code);
  return state ? state.LABEL : "Unknown";
};

const getStateCode = (key) => {
  const state = STATES[key?.trim().toUpperCase()];
  return state ? state.CODE : null;
};

module.exports = { STATES, STATE_KEYS, getStateLabel, getStateCode };
