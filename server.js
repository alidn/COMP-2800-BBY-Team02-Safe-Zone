/* eslint-disable no-use-before-define */
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const { DatabaseClient } = require("./database/user");

const bcrypt = require("bcrypt");
let collectionArray = [];

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
app.set("view engine", "ejs");
app.get("/react/*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "build/"),
  });
});

// This is necessary since we are using socketIO
const httpServer = http.createServer(app);
new DatabaseClient().then((database) => {
  app.locals.databaseClient = database;
  app.locals.usersCollection = database.users;
  const collection = database.client.db("game").collection("users");
  app.locals.collection = collection;
  let x = collection.find().toArray(function (err, docs) {
    collectionArray = docs;
  });
  app.locals.ids = [];
  console.log("connected to the database");
  httpServer.listen(port, () => console.log(`app listening at port ${port}`));
});

app.post("/api/:username/score", async (req, res) => {
  let username = req.params.username;
  let score = req.body.score;
  console.log(req.body, req.params);
  console.log(`adding ${username}'s score: ${score}`);
  let { error } = await app.locals.databaseClient.addScore(username, score);
  if (error != null) {
    console.log("ERROR!", error);
  }
});

app.get("/api/:username/maxscore", async (req, res) => {
  let username = req.params.username;
  let { scores, error } = await app.locals.databaseClient.topScores(
    username,
    1
  );
  if (error != null) {
    res.json({
      score: "?",
    });
  } else {
    if (scores.length === 0) {
      res.json({
        score: 0,
      });
    } else {
      res.json({
        score: scores[0],
      });
    }
  }
});

app.get("/api/:username/gamesplayed", async (req, res) => {
  let username = req.params.username;
  let result = app.locals.databaseClient.gamesPlayed(username);
  res.json({
    gamesPlayed: result,
  });
});

// this object contains the list of possible errors that might occur
// in the multiplayer mode.
const errors = {
  invalidRoomId: (id) => `Room id ${id} not found.`,
};

// the list of events in the multiplayer mode.
const roomEvents = {
  joinRoom: "join-room",
  createRoom: "createRoom",
  newUserJoined: "new-user-joined",
  chatroomMessage: "chatroom-message",
  mousePosition: "mouse-position",
  roomCreated: "room-created",
  allJoinedUsers: "all-joined-users",
  scoreReport: "score-report",
};

let websocketServer = newWebsocketServer(httpServer);

/**
 * Creates and returns a websocket server.
 * @param server
 * @returns {SocketIO.Server | *}
 */
function newWebsocketServer(server) {
  const socketIOServer = socketIo(server);
  let rooms = [];
  socketIOServer.on("connect", (socket) => {
    socket.on(roomEvents.joinRoom, (roomID, username, pass) => {
      const wasSuccessful = handleJoinRoom(
        socketIOServer,
        rooms,
        socket,
        roomID,
        username,
        pass
      );
      if (!wasSuccessful) {
        console.log(rooms);
        return;
      }
      console.log(`${username} joined ${roomID}`);

      handleChatroomMessage(socketIOServer, socket, roomID);
      handleMousePosition(socketIOServer, socket, roomID);
    });
    socket.on(roomEvents.createRoom, () => {
      let roomID = getRandomRoomID(rooms);
      let newRoom = createRoom(roomID);
      rooms.push(newRoom);
      socket.emit(roomEvents.roomCreated, roomID);
      console.log(`room ${roomID} was created`);
    });
  });
  return socketIOServer;
}

/**
 * Creates and returns an empty room with the given room id.
 * @param {Number} roomID - the room id of the new room to create.
 * @returns {{roomID: Number, users: []}}
 */
function createRoom(roomID) {
  return {
    roomID: roomID,
    users: [],
  };
}

/**
 * Generates and returns a random room id between 0 and 1000.
 * @param {Array} rooms
 * @returns {number}
 */
function getRandomRoomID(rooms) {
  return Math.floor(Math.random() * 1000);
}

/**
 * this function handles the mouseMove event.
 * @param server the socket server.
 * @param socket the client socket.
 * @param roomID the room id.
 */
function handleMousePosition(server, socket, roomID) {
  socket.on(roomEvents.mousePosition, (username, mousePosition) => {
    server.to(roomID).emit(roomEvents.mousePosition, username, mousePosition);
  });
}

/**
 * This function handles chatroom messages. It receives a message and sends it
 * to everyone else in that room.
 * @param server
 * @param socket
 * @param roomID
 */
function handleChatroomMessage(server, socket, roomID) {
  socket.on(roomEvents.chatroomMessage, (message) => {
    console.log(`got message ${JSON.stringify(message)}`);
    sendChatroomMessageToAllInRoom(server, roomID, message);
  });
}

/**
 * Sends a chatroom message to everyone in the given room.
 * @param server the socket server.
 * @param {Number} roomID - the room id.
 * @param {String} message - the message
 */
function sendChatroomMessageToAllInRoom(server, roomID, message) {
  emitEventToAllInRoom(server, roomID, roomEvents.chatroomMessage, message);
}

/**
 * the handler for the 'join-room' event.
 * @param server - the socket server.
 * @param {Array<Object>}rooms - the list of room.
 * @param socket - the client socket.
 * @param {Number} roomID - the room id.
 * @param {String} username - the username of the person who wants to join.
 * @param {String} pass - the password of the room.
 * @returns {boolean} whether or not the user successfully joined.
 */
function handleJoinRoom(server, rooms, socket, roomID, username, pass) {
  if (isRoomIDValid(rooms, roomID)) {
    socket.join(roomID);
    addUserToRoomsLocalStorage(rooms, roomID, username);
    reportAllJoinedUsers(server, roomID, rooms);
    reportSuccess(socket, "join");
    return true;
  }
  reportError(socket, "join", errors.invalidRoomId(roomID));
  return false;
}

/**
 * Sends the list of all users in the room to all users.
 * @param server - the socket server
 * @param {Number}  roomID - the room id.
 * @param {Array<Object>} rooms - the list of all rooms.
 */
function reportAllJoinedUsers(server, roomID, rooms) {
  let room = rooms.find((r) => r.roomID == roomID);
  let users = [];
  for (let i = 0; i < room.users.length; i++) {
    users.push(room.users[i].username);
  }
  console.log(
    `sending all users in room ${JSON.stringify(
      room
    )} with roomID ${roomID}, ${JSON.stringify(users)}`
  );
  // emitEventToAllInRoom(server, roomID, roomEvents.allJoinedUsers, users);
  server.to(roomID).emit(roomEvents.allJoinedUsers, users);
}

function emitEventToAllInRoom(server, roomID, event, ...args) {
  server.to(roomID).emit(event, args);
}

function reportSuccess(socket, event, message) {
  socket.emit(`${event}-successful`, message);
}

function reportError(socket, event, error) {
  socket.emit(`failed-${event}`, error);
}

function addUserToRoomsLocalStorage(rooms, roomID, username) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].roomID == roomID) {
      rooms[i].users.push({
        username,
        score: 0,
      });
      console.log(`addded ${username} to room ${roomID}`);
    }
  }
}

function isRoomIDValid(rooms, roomID) {
  // strict equality (===) is not used because type of roomID and room.roomID
  // might be different.
  // TODO: use strict equality and convert the string to integer.
  return rooms.some((room) => room.roomID == roomID);
}

/**
 * When a get request for '/leaderbaord' occurs, load the leaderboard-page with array of users
 */
app.get("/ejs/leaderboard", (req, res) => {
  sortScores();
  console.log(collectionArray);
  res.render("leaderboard", { userArray: collectionArray });
});
/**
 * When a get request happens to myAccount, render the myAccount apge
 */
app.get("/ejs/myAccount", (req, res) => {
  res.render("myAccount");
});
/**
 * When a request happen to login, renger the login page
 */
app.get("/ejs/login", (req, res) => {
  res.render("login");
});
/**
 * When a user signs up a encrypted password is made for them, if all the validation checks pass then the user is created and added to the database, at which point the myAccount will be rendered
 */
app.post("/ejs/signup", async (req, res) => {
  let hashedPass = await bcrypt.hash(req.body.passwordInput, 10);
  // console.log(req.body);
  // console.log(req.body.emailInput);
  // console.log(req.body.usernameInput);
  // console.log(req.body.passwordInput);
  let userColl = app.locals.collection;
  let x = userColl.find().toArray(function (err, docs) {
    //Loop through all users
    for (let i = 0; i < docs.length; i++) {
      //Check to see if form data already exists in db
      if (docs[i].username == req.body.usernameInput) {
        res.json({ success: false, error: "Username already exists." });
        return;
      }
      //Check to see if form data already exists in db
      if (docs[i].email == req.body.emailInput) {
        res.json({ success: false, error: "Email already exsits." });
        return;
      }
    }
    userColl.insertOne({
      username: req.body.usernameInput,
      password: hashedPass,
      email: req.body.emailInput,
      scores: [],
      friendsList: [],
    });
    res.json({ success: true, password: hashedPass });
    res.render("views/myAccount");
  });
});
/**
 * When a post request is made to myAccount
 * Either its an attemp to add friend, which will check to see if the friend exists in the friends list and if it doesnt the add them
 * If its remove friend then the same checks will apply and the appropraite action will take place
 * if its neither of the option then a user ref is passed back to myAccount to load the page
 */
app.post("/ejs/myAccount", async (req, res) => {
  if (req.body.submit === "ADD FRIEND") {
    let userColl = app.locals.collection;
    let user = await userColl.findOne({ username: req.body.friendID });

    if (user) {
      //add friendID to freindsList if its not already there
      try {
        userColl.updateOne(
          { username: req.body.ownUser },
          { $push: { friendsList: req.body.friendID } },
          { upsert: true }
        );
        res.render("myAccount");
      } catch (e) {
        print(e);
      }
    } else if (user === null) {
      //alert that the usre doesnt exist in teh database
    }
  } else if (req.body.submit === "REMOVE FRIEND") {
    let userColl = app.locals.collection;
    userColl.update(
      { username: req.body.ownUser },
      { $pull: { friendsList: { $in: [req.body.friendID] } } }
    );
    res.render("myAccount");
  } else {
    let userColl = app.locals.collection;
    let user = await userColl.findOne({ username: req.body.username });
    // console.log(user);
    res.json(user);
  }
});

/**
 * Upon sending a post request to signin, the following will happen
 * bcrypit will compare the hashed password to ensure its valid
 * if it is vald send the hashedpassword back to the myAccount page to load up the account details
 * if password is incorrect an alert will popup informing the user
 */
app.post("/ejs/signin", async (req, res) => {
  // console.log(req.body);
  console.log(req.body.usernameInput);
  console.log(req.body.passwordInput);
  let userColl = app.locals.collection;
  let x = userColl.find().toArray(async function (err, docs) {
    console.log(docs);
    //Loop through all users
    for (let i = 0; i < docs.length; i++) {
      //Check to see if form data already exists in db
      if (
        (await bcrypt.compare(req.body.passwordInput, docs[i].password)) &&
        docs[i].username == req.body.usernameInput
      ) {
        console.log(
          "Login password: " +
            req.body.passwordInput +
            ", hashPass: " +
            docs[i].password
        );
        res.json({ success: true, password: docs[i].password });
        return;
      }
    }
    res.json({ success: false, error: "Account not found!" });
  });
});

//This function will go through every user and sort the scores from highest to lowerst
function sortScores() {
  for (let i = 0; i < collectionArray.length; i++) {
    collectionArray[i].scores.sort((a, b) => {
      if (b.score && a.score) {
        return b.score > a.score ? 1 : -1;
      } else if (a.score && !b.score) {
        return -1;
      } else if (b.score && !a.score) {
        return 1;
      } else {
        return 1;
      }
    });
  }
  collectionArray.sort((a, b) => {
    if (b.scores.length && a.scores.length) {
      return b.scores[0].score > a.scores[0].score ? 1 : -1;
    } else if (a.scores.length && !b.scores.length) {
      return -1;
    } else if (b.scores.length && !a.scores.length) {
      return 1;
    } else {
      return -1;
    }
  }); // sorts users collection by the highest scores.
}
