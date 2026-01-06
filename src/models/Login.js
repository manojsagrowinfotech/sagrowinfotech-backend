module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "login",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      email_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      access_token_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      refresh_token_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      ip_address: {
        type: DataTypes.STRING(50),
      },

      user_agent: {
        type: DataTypes.TEXT,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      created_by: {
        type: DataTypes.STRING(100),
      },
    },
    {
      tableName: "login",
      schema: "sagrow_admin",
      timestamps: true,
      createdAt: "login_time",
      updatedAt: false,
    }
  );
};
