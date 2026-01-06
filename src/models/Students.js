module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "students",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      mobileNo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "mobile_no",
      },

      emailId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "email_id",
      },

      experienceLevel: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: "experience_level",
      },

      yearsOfExperience: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        field: "years_of_experience",
      },

      state: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },

      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "created_by",
      },
    },
    {
      tableName: "students",
      schema: "sagrow_admin",
      timestamps: true,
      createdAt: "created_time",
      updatedAt: false,
    }
  );
};
