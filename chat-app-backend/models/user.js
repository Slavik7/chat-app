const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { boolean } = require("joi");
require("dotenv").config();

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 50,
  },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
});

const notificationsSchema = new mongoose.Schema({
  message: { type: String },
  createdAt: { type: Date, default: new Date() },
});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 1024,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  notifications: [notificationsSchema],
  alert: {
    requests: { type: Boolean, default: false, require: true },
    notifications: { type: Boolean, default: false, require: true },
  },
});

userSchema.methods.genAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name },
    process.env.JWT_SECRET_KEY
  );
};
const User = mongoose.model("User", userSchema);
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
