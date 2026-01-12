module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      emailId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: "email_id",
      },

      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "password_hash",
      },

      fullName: {
        type: DataTypes.STRING(100),
        field: "full_name",
      },

      mobileNo: {
        type: DataTypes.STRING(15),
        field: "mobile_no",
      },

      role: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "U",
      },

      state: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "N",
      },

      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_locked",
      },

      resetPasswordToken: {
        type: DataTypes.STRING,
        field: "reset_password_token",
      },

      resetPasswordExpires: {
        type: DataTypes.DATE,
        field: "reset_password_expires",
      },

      otp: {
        type: DataTypes.STRING,
        field: "otp",
      },

      otpExpires: {
        type: DataTypes.DATE,
        field: "otp_expires",
      },

      otpResendCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "otp_resend_count",
      },

      otpLastSentAt: {
        type: DataTypes.DATE,
        field: "otp_last_sent_at",
      },

      loginFailed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "login_failed",
      },

      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "created_by",
      },
    },
    {
      tableName: "users",
      schema: "sagrow_admin",
      timestamps: true,
      createdAt: "created_time",
      updatedAt: false,
    }
  );
};
