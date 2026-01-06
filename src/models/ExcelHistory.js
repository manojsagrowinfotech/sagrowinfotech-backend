module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "excel_history",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      excelSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "excel_size",
      },

      studentCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "student_count",
      },

      downloadTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "download_time",
      },

      downloadBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "download_by",
      },
    },
    {
      tableName: "excel_history",
      schema: "sagrow_admin",
      timestamps: true,
      createdAt: "download_time",
      updatedAt: false,
    }
  );
};
