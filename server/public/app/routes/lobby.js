const router = require("express").Router();
const cors = require("cors");
const socketIo = require("socket.io");

// const io = socketIo(server);


router.post("/createLobby", function (req, res) {
  let id = generateRandomId();

  res.json({
    id: id,
  });
});

function generateRandomId() {
  return Math.floor(Math.random() * 1000);
}

module.exports = router;
