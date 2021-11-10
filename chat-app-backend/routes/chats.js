const mongoose = require("mongoose");
const express = require("express");
const { Chat, validate } = require("../models/chat.js");
const { User } = require("../models/user.js");
const Image = require("../models/image.js");
const fs = require("fs");
const auth = require("../middleware/auth.js");
const router = express.Router();
const pusher = require("../pusher.js");

// Adding new chat to the DB
router.post("/new", auth, async (req, res) => {
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id).select("_id chats name image");
  const members = await Promise.all(
    req.body.members.map(async (member) => {
      const u = await User.findById(member).select("_id name chats image");
      if (u) return u;
    })
  );
  if (!members) return res.status(400).send("Error in members");
  const chat = new Chat({
    name: req.body.name,
    members: [...req.body.members, req.user._id],
    manager: [req.user._id],
    messages: [],
  });
  const image = new Image({ image: "" });
  await image.save();
  chat.messages.push({
    sender: user._id,
    content: `created the chat`,
    createdAt: new Date(),
    isInfo: true,
  });
  chat.image = image._id;
  members.forEach(async (u) => {
    u.chats.push(chat._id);
    chat.messages.push({
      sender: u._id,
      content: `been added to the chat`,
      createdAt: new Date(),
      isInfo: true,
    });
    await u.save();
  });
  user.chats.push(chat._id);
  await chat.save();
  await user.save();
  chat.members.forEach((member) =>
    pusher.trigger(`user_${member}`, "chat", { chat: chat })
  );
  res.status(200).send(chat);
});

//get all the chats
router.get("/", auth, async (req, res) => {
  const userChats = await User.findById(req.user._id)
    .select("chats")
    .populate({ path: "chats", select: "-messages", populate: "image" });

  if (!userChats) return res.status(400).send("Error");
  return res.status(200).send(userChats.chats);
});

// adding user to chat
router.put("/adduser", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId)
    .populate("image")
    .populate({
      path: "members",
      select: "name image",
      populate: "image",
    })
    .populate({
      path: "messages.sender",
      select: "name image",
      populate: "image",
    });
  const managerCheck = chat.manager.filter((manager) =>
    manager.equals(req.user._id)
  );
  const membersCheck = chat.members.filter((member) =>
    member.equals(req.body.addId)
  );
  if (managerCheck.length > 0) {
    if (membersCheck.length === 0) {
      const userAdd = await User.findById(req.body.addId)
        .select("_id name image chats notifications alert")
        .populate("image");

      chat.messages.push({
        sender: {
          _id: userAdd._id,
          name: userAdd.name,
        },
        content: `added to the chat`,
        createdAt: new Date(),
        isInfo: true,
      });
      chat.members.push({
        _id: userAdd._id,
        name: userAdd.name,
        image: userAdd.image,
      });
      userAdd.chats.push(chat._id);
      await chat.save();
      chat.members.forEach((member) =>
        pusher.trigger(`user_${member._id}`, "chat", {
          chat: chat,
        })
      );
      const notif = {
        message: `you been added to the chat: ${chat.name}`,
        createdAt: new Date(),
      };

      userAdd.notifications.unshift(notif);
      userAdd.alert.notifications = true;
      pusher.trigger(`user_${userAdd._id}`, "chat", {
        chat: chat,
        notifications: userAdd.notifications,
        alert: userAdd.alert,
      });
      await userAdd.save();

      return res.status(200).send(chat);
    }
  }
});

// removes user from the chat members
router.put("/removeuser", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId)
    .populate({
      path: "members",
      select: "name image",
      populate: "image",
    })
    .populate({
      path: "messages.sender",
      select: "name image",
      populate: "image",
    })
    .populate("image");
  const user = await User.findById(req.body.removeId).select(
    "name chats notifications alert"
  );
  const managerCheck = chat.manager.filter((manager) =>
    manager.equals(req.user._id)
  );
  const memberIndex = chat.members.findIndex((member) =>
    member._id.equals(req.body.removeId)
  );
  const chatIndex = user.chats.findIndex((chat) => chat._id == req.body.chatId);
  if (managerCheck.length > 0) {
    if (memberIndex >= 0) {
      chat.members.splice(memberIndex, 1);
      user.chats.splice(chatIndex, 1);
      chat.messages.push({
        sender: { _id: user._id, name: user.name },
        content: `kicked from the chat`,
        createdAt: new Date(),
        isInfo: true,
      });
      await chat.save();
      const notif = {
        message: `you been kicked from chat: ${chat.name}`,
        createdAt: new Date(),
      };
      user.notifications.unshift(notif);
      user.alert.notifications = true;
      await user.save();
      chat.members.forEach((member) =>
        pusher.trigger(`user_${member._id}`, "chat", {
          chat: chat,
        })
      );
      pusher.trigger(`user_${user._id}`, "chat", {
        removed: true,
        notification: user.notifications,
        alert: user.alert,
      });
      return res.status(200).send(chat.members);
    }
  }
});

router.put("/changename", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId)
    .populate("image")
    .populate({
      path: "members",
      select: "name image",
      populate: "image",
    })
    .populate({
      path: "messages.sender",
      select: "name image",
      populate: "image",
    });

  if (req.body.name.length > 1) {
    chat.name = req.body.name;
    chat.messages.push({
      sender: { name: req.user.name, _id: req.user._id },
      content: `changed the chat name to: ${req.body.name}`,
      createdAt: new Date(),
      isInfo: true,
    });
    await chat.save();
  }
  chat.members.forEach((member) =>
    pusher.trigger(`user_${member._id}`, "chat", { chat: chat })
  );
  return res.status(200).send(chat);
});
//route to leave the chat
router.put("/leave", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId).populate("image").populate({
    path: "members",
    select: "name image",
    populate: "image",
  });
  const user = await User.findById(req.user._id).select("chats");
  const managerIndex = chat.manager.findIndex((manager) =>
    manager.equals(req.user._id)
  );
  const memberIndex = chat.members.findIndex((member) =>
    member._id.equals(req.user._id)
  );
  const chatIndex = user.chats.findIndex((chat) => chat._id == req.body.chatId);
  if (memberIndex < 0) return res.status(400).send("not a member in the chat");
  if (chatIndex >= 0) {
    user.chats.splice(chatIndex, 1);
    await user.save();
  }
  if (chat.members.length === 1) {
    if (chat.image) {
      const image = await Image.findById(chat.image);
      if (image?.image) {
        fs.unlink(`./uploads/${image.image}`, (err) => {
          if (err) console.log(err);
        });
      }
      await image.remove();
    }
    await chat.remove();

    res.status(200).send({ message: "Chat Deleted" });
  } else {
    chat.members.splice(memberIndex, 1);
    if (managerIndex >= 0) chat.manager.splice(managerIndex, 1);
    if (chat.members.length >= 1 && chat.manager.length == 0) {
      chat.manager.push(chat.members[0]._id);
    }
  }
  chat.messages.push({
    sender: { name: req.user.name, _id: req.user._id },
    content: `is leaved the chat`,
    createdAt: new Date(),
    isInfo: true,
  });
  await chat.save();
  chat.members.forEach((member) =>
    pusher.trigger(`user_${member._id}`, "chat", { chat: chat })
  );

  res.status(200).send("user leaved the chat");
});
//TODO: delete the chat from the db and the members chats db
router.delete("/delete", auth, async (req, res) => {
  const managerCheck = chat.manager.filter(
    (manager) => manager._id == req.user._id
  );
  if (managerCheck.length == 0)
    return res
      .status(400)
      .send("Only the chat manager allowed to delete the chat");
  const chat = await Chat.findById(req.body.id).select("members");
  const members = await Promise.all(
    chat.members.map(async (member) => {
      const u = await User.findById(member._id).select("_id name chats");
      if (u) return u;
    })
  );
  if (!members) return res.status(400).send("Error in members");
  //TODO: delete the chat from all the members
});

router.get("/members/:id", auth, async (req, res) => {
  await Chat.findById(req.params.id)
    .select("members")
    .populate({ path: "members", select: "name image", populate: "image" })
    .then((result) => {
      return res.status(200).send(result.members);
    });
});

router.put("/manager/add", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId).select(
    "name manager members"
  );
  const user = await User.findById(req.body.id).select(
    "name notifications alert"
  );
  if (chat) {
    //checking if the user itself is an manager
    const index = chat.manager.findIndex((manager) => {
      return manager.equals(req.user._id);
    });
    //checking if the new manager is not an manger
    const index2 = chat.manager.findIndex((manager) => {
      return manager.equals(user._id);
    });

    if (index > -1 && index2 === -1) {
      chat.manager.push(user._id);
      await chat.save();
      const notif = {
        message: `${req.user.name} added you to the managers of the chat: ${chat.name}`,
        createdAt: new Date(),
      };
      user.notifications.unshift(notif);
      user.alert.notifications = true;
      await user.save();
      chat.members.forEach((member) => {
        if (!member._id.equals(user._id))
          pusher.trigger(`user_${member}`, "chat", {
            chat: { _id: chat._id, manager: chat.manager },
          });
        else
          pusher.trigger(`user_${member}`, "chat", {
            chat: { _id: chat._id, manager: chat.manager },
            notifications: user.notifications,
            alert: user.alert,
          });
      });
      return res.status(200).send("Manager added");
    }
  }
});
router.put("/manager/remove", auth, async (req, res) => {
  const chat = await Chat.findById(req.body.chatId).select(
    "name manager members"
  );
  const user = await User.findById(req.body.id).select(
    "name notifications alert "
  );
  if (chat) {
    //checking if the user itself is an manager
    const index = chat.manager.findIndex((manager) => {
      return manager.equals(req.user._id);
    });
    //checking if the new manager is not an manger
    const index2 = chat.manager.findIndex((manager) => {
      return manager.equals(user._id);
    });

    if (index > -1 && index2 > -1) {
      chat.manager.splice(index2, 1);
      await chat.save();
      const notif = {
        message: `${req.user.name} removed you from the managers of the chat: ${chat.name}`,
        createdAt: new Date(),
      };
      user.notifications.unshift(notif);
      user.alert.notifications = true;
      await user.save();
      chat.members.forEach((member) => {
        if (!member._id.equals(user._id))
          pusher.trigger(`user_${member}`, "chat", {
            chat: { _id: chat._id, manager: chat.manager },
          });
        else
          pusher.trigger(`user_${member}`, "chat", {
            chat: { _id: chat._id, manager: chat.manager },
            notifications: user.notifications,
            alert: user.alert,
          });
      });
      return res.status(200).send("Manager removed");
    }
  }
});
const chatManagerCheck = (id, chat) => {
  return chat.manager.findIndex((mngr) => mngr._id == id) >= 0;
};

//trigger the pusher to real time changes

module.exports = router;
