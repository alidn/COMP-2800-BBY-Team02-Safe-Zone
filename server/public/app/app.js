const express = require("express");
const { DatabaseClient } = require("./database/user");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require("./routes/user"));
app.use(require("./routes/lobby"));
app.use(express.static(path.join(__dirname, "build")));

const server = http.createServer(app);

let ids = [];
let rooms = new Map();
let scores = new Map();

const io = socketIo(server);
io.on("connect", (socket) => {
  let roomId;
  socket.on("join", ({ id, username }) => {
      console.log("someone's tryina join ", id); console.log("room ids", ids);
    let joined = false;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] == id) {
        console.log("Found an id that matches");

        roomId = id;

        joined = true;
      }
    }
    if (!joined) {
      console.log("no id found");
      socket.emit("failed");
    } else {
      socket.join(roomId);
      let prevScores = scores.get(roomId);
      if (prevScores === null || prevScores === undefined) {
        scores.set(roomId, []);
      }
      let prevRoom = rooms.get(roomId);
      if (prevRoom === null || prevRoom === undefined) {
        rooms.set(roomId, []);
      }
      console.log("prev users", rooms.get(roomId));
      prevRoom = rooms.get(roomId);
      prevRoom.push(username);
      prevScores = scores.get(roomId);
      prevScores.push({
        username: username,
        value: 0,
      });
      rooms.set(roomId, prevRoom);
      scores.set(roomId, prevScores);
      socket.on("message", ({ message, username }) => {
        console.log("got message", message);
        io.to(roomId).emit("msg", { message, username });
        io.to(roomId).emit("all-users", rooms.get(roomId), false);
        io.to(roomId).emit("all-scores", scores.get(roomId));
      });
      socket.emit("joined");

      socket.on("pos", ({ username, force }) => {
        console.log("Emitting position", username, force);

        io.to(roomId).emit("position", { username: username, force: force });
      });

      socket.on("win", (username) => {
        console.log("Somybody won!");

        io.to(roomId).emit("end", username);
      });

      socket.on("start-c", () => {
        io.to(roomId).emit("start");
      });

      socket.on("restart-c", () => {
        io.to(roomId).emit("restart");
      });

      socket.on("inc-score", (username) => {
        let allScores = scores.get(roomId);
        for (let i = 0; i < allScores.length; i++) {
          console.log(allScores[i].username, username);
          if (allScores[i].username === username) {
            allScores[i].value++;
            console.log("increasing score", username, allScores[i].value);
          }
        }
        rooms.set(roomId, allScores);
        console.log("All scores: ", scores.get(roomId));
        io.to(roomId).emit("all-scores", scores.get(roomId));
      });

      io.to(roomId).emit("all-users", rooms.get(roomId), true);
      console.log("all users", rooms.get(roomId));
    }
  });
  socket.on("createRoom", (room) => ids.push(room));
  socket.on("login", async ({ username, password }) => {
    console.log("checking ", username, password);

    let db = app.locals.databaseClient;
    let user = await db.getUserByUsername(username);
    console.log("should be", user);
    if (user === null) {
      socket.emit("login-failed");
    } else if (user.username === username && user.password === password) {
      socket.emit("loggedin");
    } else {
      socket.emit("login-failed");
    }
  });
  socket.on("register", async ({ username, password, email }) => {
    console.log("Trying to register");
    let db = app.locals.databaseClient;
    let { ok, error } = await db.addUser({ username, password, email });
    if (ok) {
      socket.emit("registered");
    } else {
      socket.emit("register-failed");
    }
  });
});

new DatabaseClient().then((db) => {
  app.locals.databaseClient = db;
  app.locals.ids = [];
  console.log("connected to the database");
  server.listen(port, () => console.log(`app listening at port ${port}`));
});
