const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
)

const SessionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    token: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true
  }
)

module.exports = { UserSchema, SessionSchema }
