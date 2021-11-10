const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user.js");
const { Chat } = require("../models/chat.js");
const auth = require("../middleware/auth.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
    .populate("image")
    .populate({ path: "requests", select: "name image", populate: "image" })
    .populate({ path: "friends", select: "name image", populate: "image" })
    .populate({ path: "chats", select: "-messages", populate: "image" });
  if (!user) return res.status(400).send("invaild email or password");
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).json({ message: "invaild email or password" });

  const token = user.genAuthToken();

  res.send({
    token: token,
    _id: user._id,
    name: user.name,
    friends: user.friends,
    requests: user.requests,
    chats: user.chats,
    image: user.image.image,
    notifications: user.notifications,
    alert: user.alert,
  });
});

router.post("/token", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("image")
    .populate({ path: "friends", select: "name image", populate: "image" })
    .populate({ path: "requests", select: "name image", populate: "image" })
    .populate({ path: "chats", select: "-messages", populate: "image" });
  if (!user) return res.status(400).send("invaild token");

  res.send({
    _id: user._id,
    name: user.name,
    token: req.header("x-auth-token"),
    friends: user.friends,
    requests: user.requests,
    chats: user.chats,
    image: user.image.image,
    notifications: user.notifications,
    alert: user.alert,
  });
});

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
};

module.exports = router;
