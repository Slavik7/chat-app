const express = require("express");
const { Chat } = require("../models/chat.js");
const { User } = require("../models/user.js");
const Joi = require("joi");
const auth = require("../middleware/auth.js");
const router = express.Router();
const pusher = require("../pusher.js");
const mongoose = require("mongoose");

router.post("/new", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const chat = await Chat.findById(req.body.id).populate({
    path: "members",
    select: "name image",
    populat: "image",
  });
  if (!chat) return res.status(400).send("there is no chat with the given id");
  const user = await User.findById(req.user._id)
    .select("_id name image")
    .populate("image");
  if (!user)
    return res.status(400).send("there is no user by the given sender id");
  const _ids = chat.members.map((member) => member._id);
  if (!_ids.includes(req.user._id))
    return res
      .status(401)
      .send("the user not allowed to send messages to the given chat");
  const timeStamp = new Date();
  const newMsg = {
    _id: new mongoose.Types.ObjectId(),
    sender: user._id,
    content: req.body.content,
    createdAt: timeStamp,
  };
  chat.messages.push(newMsg);
  chat.lastMessage = {
    sender: user._id,
    content: req.body.content,
    createdAt: timeStamp,
  };
  await chat.save();
  chat.members.forEach((member) =>
    pusher.trigger(`user_${member._id}`, "message", {
      chatId: chat._id,
      msg: {
        ...newMsg,
        sender: { _id: user._id, name: user.name, image: user.image },
      },
    })
  );
  res.status(200).send(chat.lastMessage);
});

router.get("/:id", auth, async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .select("messages")
    .sort("messages.createdAt")
    .populate({
      path: "messages.sender",
      select: "name image",
      populate: "image",
    });

  if (!chat) return res.status(400).send("there is no chat with the given id");

  res.send(chat.messages);
});

const validate = (msg) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1),
    id: Joi.string().required(),
  });
  return schema.validate(msg);
};

module.exports = router;
