const express = require("express");
const { DatabaseClient } = require("../database/user");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const port = 3000;

app.use(require("./routes/user"));
app.use(express.static(path.join(__dirname, "public")));

new DatabaseClient().then((db) => {
  app.locals.databaseClient = db;
  console.log("connected to the database");
  app.listen(port, () => console.log(`app listening at port ${port}`));
});

const wss = new WebSocket.Server({ port: 8080, path: "/zas" });

wss.on("connection", function connection(ws) {
  ws.send("connected to the server");
  ws.on("message", function incoming(message) {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send("new message: " + message);
      }
    });
  });
});
