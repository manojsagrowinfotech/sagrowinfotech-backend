module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "logout",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      user_login_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      ip_address: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "logout",
      schema: "sagrow_admin",
      timestamps: true,
      createdAt: "logout_time",
      updatedAt: false,
    }
  );
};
