const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const express = require("express");
const { User } = require("../models/user.js");
const { Chat } = require("../models/chat.js");
const fs = require("fs");
const Image = require("../models/image");
const router = express.Router();
const pusher = require("../pusher.js");
router.post("/", [auth, upload], async (req, res) => {
  const user = await User.findById(req.user._id).select("image");
  if (!user.image) {
    const newImage = new Image({ image: `${req.file.filename}` });
    user.image = newImage._id;
    await newImage.save();
    await user.save().then((r) => {
      return res.status(200).send("Image Updated");
    });
  } else if (user.image) {
    const image = await Image.findById(user.image);
    if (image.image.length > 0)
      fs.unlink(`./uploads/${image.image}`, (err) => {
        if (err) console.log(err);
      });
    image.image = req.file.filename;
    await image.save().then((r) => {
      return res.status(200).send("Image Updated");
    });
  }
});
router.put("/chat/:id", [auth, upload], async (req, res) => {
  const chat = await Chat.findById(req.params.id).select("image members");
  if (!chat.image) {
    const newImage = new Image({ image: `${req.file.filename}` });
    chat.image = newImage._id;
    await newImage.save();
    await chat.save();
    chat.members.forEach((member) =>
      pusher.trigger(`user_${member}`, "chat", {
        chat: { _id: chat._id, image: newImage },
      })
    );
    return res.status(200).send("Image Updated");
  } else if (chat.image) {
    const image = await Image.findById(chat.image);
    if (image.image.length > 0)
      fs.unlink(`./uploads/${image.image}`, (err) => {
        if (err) console.log(err);
      });
    image.image = req.file.filename;
    await image.save();
    chat.members.forEach((member) =>
      pusher.trigger(`user_${member}`, "chat", {
        chat: { _id: chat._id, image: image },
      })
    );
    return res.status(200).send("Image Updated");
  }
});
router.get("/chat/:id", auth, async (req, res) => {
  const image = await Chat.findById(req.params.id)
    .populate("image")
    .select("image");
  res.status(200).send(image.image);
});
router.get("/", auth, async (req, res) => {
  const image = await User.findById(req.user._id)
    .populate("image")
    .select("image");
  res.status(200).send(image.image);
  // const image = await Image.findById(user.image);
  // if (user && image) return res.status(200).send(image.image);
  // else return res.send("No Image yet");
});

module.exports = router;
