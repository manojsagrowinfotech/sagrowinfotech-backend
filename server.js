require("dotenv").config();

const app = require("./src/gateway");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
