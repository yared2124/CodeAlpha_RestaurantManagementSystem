import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "staff", "customer"),
      defaultValue: "customer",
    },
    firstName: { type: DataTypes.STRING(100) },
    lastName: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
  },
  {
    timestamps: true,
    paranoid: true, // soft-delete (deletedAt column)
  },
);

export default User;
