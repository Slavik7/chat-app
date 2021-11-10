const mongoose = require("mongoose");
const Joi = require("joi");

const msgSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  content: { type: String, require: true, minlength: 1 },
  createdAt: { type: Date, default: new Date() },
  isInfo: { type: Boolean, default: false },
});

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  createdAt: { type: Date, default: new Date() },
  messages: [msgSchema],
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  ],
  manager: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  ],
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  lastMessage: msgSchema,
});

const validate = (chat) => {
  const msgSchema = Joi.object({
    sender: Joi.string().required(),
    content: Joi.string().required().min(1),
  });

  const schema = Joi.object({
    messages: Joi.array().items(msgSchema),
    members: Joi.array().items(mongoose.Types.ObjectId).required(),
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(chat);
};
const Chat = mongoose.model("Chat", chatSchema);

module.exports.Chat = Chat;
module.exports.validate = validate;
