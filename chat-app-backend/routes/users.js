const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.js");
const Image = require("../models/image.js");
const auth = require("../middleware/auth.js");
const pusher = require("../pusher.js");
const router = express.Router();
router.post("/new", async (req, res) => {
  //validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const registered = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (registered) return res.status(400).send("User email already registered");
  const user = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    notifications: [],
    alert: {},
    requests: [],
  });
  const image = new Image({ image: "" });
  await image.save();

  user.image = image._id;

  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(user.password, salt);
  user.password = hashedPass;
  await user.save();
  const token = user.genAuthToken();
  res.send({
    _id: user._id,
    name: user.name,
    token: token,
  });
});

// find friends
router.get("/find", auth, async (req, res) => {
  const regex = new RegExp([".*", req.query.query, "*."].join(""), "i");
  const users = await User.find({
    name: regex,
  })
    .select("_id name image")
    .populate("image");
  if (users) return res.send(users);
});

//changing the password
router.put("/changepassword", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("password");
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) return res.status(400).send("wrong password");
  else {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPass;
    await user.save();
  }
  res.status(200).send("password changed");
});

//change the name
router.put("/changename", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("name _id");
  if (!user) return res.status(400).send("User not found");
  else {
    user.name = req.body.newName;
    await user.save();
    const token = user.genAuthToken();
    res.status(200).send({ token: token, _id: user._id, name: user.name });
  }
});
//getting the friends list
router.get("/friends", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("friends")
    .populate({ path: "friends", select: "name image", populate: "image" });
  if (!user) return res.status(400).send("Error with the user id");
  res.send(user.friends);
});
// adding the friends requests to the target user // accepting in body: id (of the target)
router.post("/add", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("_id name image");
  const userToAdd = await User.findById(req.body.id).select(
    "requests friends alert"
  );
  if (!userToAdd) return res.status(400).send("No such user");
  //checking if the request already there
  const index = userToAdd.requests.findIndex((fReq) => fReq.equals(user._id));
  if (index === -1) {
    userToAdd.requests.push(user._id);
    userToAdd.alert.requests = true;
    pusher.trigger(`user_${userToAdd._id}`, "friends", {
      requests: [
        {
          _id: user._id,
          name: user.name,
          image: user.image,
        },
      ],
      alert: userToAdd.alert,
    });
    await userToAdd.save();

    res.status(200).send("Friend request sended");
  } else {
    res.status(200).send("Friend request already sended");
  }
});

//getting the requests
router.get("/requests", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("requests")
    .populate({ path: "requests", select: "name image", populate: "image" });
  if (!user) return res.status(400).send("bad user id");
  res.status(200).send(user.requests);
});

//accepting requests and adding friends // accepting in body: id (of the target)
router.post("/acceptrequest", auth, async (req, res) => {
  const userId = req.user._id;
  const userToAdd = await User.findById(req.body.id)
    .select("_id friends name image alert notifications")
    .populate({ path: "friends", select: "name image", populate: "image" });
  const user = await User.findById(userId)
    .select("requests friends name image")
    .populate("image")
    .populate({ path: "friends", select: "name image", populate: "image" });
  if (!userToAdd) return res.status(400).send("No such user");
  if (!user) return res.status(400).send("No such user");
  if (user._id.equals(userToAdd._id))
    return res.status(400).send("same user id");
  const indOfFriend = user.friends.findIndex((u) =>
    u._id.equals(userToAdd._id)
  );
  if (indOfFriend > -1)
    return res.status(400).send("user already in friends list");
  user.friends.push({
    _id: userToAdd._id,
    name: userToAdd.name,
    image: userToAdd.image,
  });
  const notif = {
    message: `${user.name} accepted your friends request`,
    createdAt: new Date(),
  };
  userToAdd.notifications.unshift(notif);
  userToAdd.alert.notifications = true;
  pusher.trigger(`user_${userToAdd._id}`, "friends", {
    notifications: userToAdd.notifications,
    friends: userToAdd.friends,
    alert: userToAdd.alert,
  });
  pusher.trigger(`user_${user._id}`, "friends", {
    friends: userToAdd.friends,
  });
  userToAdd.friends.push({ _id: userId, name: user.name, image: user.image });
  const index = user.requests.findIndex((u) => {
    return u.equals(userToAdd._id);
  });
  user.requests.splice(index, 1);
  await user.save();
  await userToAdd.save();
  res.status(200).send(true);
});

//rejecting the friend request
router.post("/rejectrequest", auth, async (req, res) => {
  const userId = req.user._id;
  const userToRemoveId = req.body.id;
  const user = await User.findById(userId).select("requests");
  if (!user) return res.status(400).send("No such user");
  const index = user.requests.findIndex((u) => u.equals(userToRemoveId));
  if (index !== -1) {
    user.requests.splice(index, 1);
    await user.save();
    res.status(200).send(true);
  }
});
//removing friend from friends list// accepting in body: id (of the target)
router.post("/removefriend", auth, async (req, res) => {
  const userId = req.user._id;
  const userToRemoveId = req.body.id;
  const user = await User.findById(userId)
    .select("friends")
    .populate({ path: "friends", select: "name image", populate: "image" });
  const userToRemove = await User.findById(userToRemoveId)
    .select("friends")
    .populate({ path: "friends", select: "name image", populate: "image" });
  if (!user || !userToRemove)
    return res.status(400).send("user or target user id ");
  const index = user.friends.findIndex((friend) =>
    friend._id.equals(userToRemoveId)
  );
  const index2 = userToRemove.friends.findIndex((friend) =>
    friend._id.equals(userId)
  );
  user.friends.splice(index, 1);
  userToRemove.friends.splice(index2, 1);
  await user.save();
  await userToRemove.save();
  pusher.trigger(`user_${user._id}`, "friends", {
    friends: user.friends,
  });
  pusher.trigger(`user_${userToRemove._id}`, "friends", {
    friends: userToRemove.friends,
  });
  res.status(200).send(true);
});

router.put("/notifications/delete", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("notifications");
  if (user) {
    const index = user.notifications.findIndex((notif) =>
      notif._id.equals(req.body.notifId)
    );
    user.notifications.splice(index, 1);
    await user.save();
    return res.status(200).send(user.notifications);
  }
});
router.put("/notifications/deleteall", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("notifications");
  if (user) {
    user.notifications = [];
    await user.save();
    return res.status(200).send(user.notifications);
  }
});
router.put("/alert/update", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("alert");
  if (user) {
    user.alert = req.body.alert;
    await user.save();
    res.status(200).send(user.alert);
  }
});

const notificationsCreator = (info) => {
  switch (info.type) {
    case "FRIEND_ACCEPTED": {
      return {
        message: `${info.name} accepted your friend request`,
        createdAt: new Date(),
      };
    }
    case "KICKED_FROM_CHAT": {
      return {
        message: `you been kicked from the chat: ${info.name}`,
        createdAt: new Date(),
      };
    }
    case "ADDED_TO_CHAT": {
      return {
        message: `you been kicked from the chat: ${info.name}`,
        createdAt: new Date(),
      };
    }
    default: {
      return 0;
    }
  }
};
module.exports = router;
