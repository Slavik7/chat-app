const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users.js");
const auth = require("./routes/auth.js");
const chats = require("./routes/chats.js");
const messages = require("./routes/messages.js");
const image = require("./routes/image.js");
require("express-async-errors");
require("dotenv").config();

//app config
const app = express();

const port = process.env.PORT || 3001;
//middleware

//app.use(cors());
app.use(cors({ origin: "https://chat-app-24a0b.web.app" }));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//routes
app.get("/", (res, req) => {
  res.status(200).send("working");
});
app.use("/uploads/", express.static("./uploads"));
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/chats", chats);
app.use("/api/chats/messages", messages);
app.use("/api/image", image);
app.use((err, req, res, next) => {
  //log the exception (examples below with winston package)
  res.status(500).send("something faild");
});

//DB config
const connection_url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.k5xml.mongodb.net/chat-app-DB?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const chatCollection = db.collection("chats");
  const changeStream = chatCollection.watch();
});
//DB model schema

app.listen(port, () => {
  console.log(`listining on port: ${port}`);
});
