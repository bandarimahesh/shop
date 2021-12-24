const mongoose = require("mongoose");

const UserModel = new mongoose.Schema(
  {
    username: {
      type: "string",
      require: true,
      unique: true,
    },
    email: { type: "string", require: true },
    password: {
      type: "string",
      require: true,
    },
    isAdmin: { type: "boolean", default: false },
    profilePicture: { type: "string" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserModel);
