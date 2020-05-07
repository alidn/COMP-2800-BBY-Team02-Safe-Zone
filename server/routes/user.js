const router = require("express").Router();

router.get("/api/user/:username", async (req, res) => {
  let username = req.params.username;
  let db = req.app.locals.databaseClient;

  let user = await db.getUserByUsername(username);
  res.json(user);
});

router.post("/login", async function (req, res) {
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  let username = req.body.username;
  let password = req.body.password;
  let db = req.app.locals.databaseClient;

  let { exists, error } = await db.usernameExists(username);

  if (!exists) {
    res.send({
      loginSuccessful: false,
      username: false,
      password: null,
      error: null,
    });
    return;
  }

  if (error !== null) {
    res.send({
      loginSuccessful: false,
      username: null,
      error: error,
      password: null,
    });
    return;
  }

  let user = await db.getUserByUsername(username);
  if (password !== user.password) {
    res.send({
      loginSuccessful: false,
      username: true,
      password: false,
      error: null,
    });
  }

  res.redirect("../public/index.html");
});

module.exports = router;
