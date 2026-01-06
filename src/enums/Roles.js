const ROLES = Object.freeze({
  USER: {
    CODE: "U",
    LABEL: "User",
  },
  ADMIN: {
    CODE: "A",
    LABEL: "Admin",
  },
});

const ROLE_KEYS = Object.keys(ROLES);

const getRoleLabel = (code) => {
  const role = Object.values(ROLES).find((r) => r.CODE === code);
  return role ? role.LABEL : "Unknown";
};

const getRoleCode = (key) => {
  const role = ROLES[key?.trim().toUpperCase()];
  return role ? role.CODE : null;
};

module.exports = { ROLES, ROLE_KEYS, getRoleLabel, getRoleCode };
