const router = require("express").Router();

router.get("/api/user/:username", async (req, res) => {
  let username = req.params.username;
  let db = req.app.locals.databaseClient;

  let user = await db.getUserByUsername(username);
  res.json(user);
});

router.post("/signup", async function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let db = req.app.locals.databaseClient;

  let { exists, error } = await db.usernameExists(username);

  if (exists) {
    res.json({
      signupSuccessful: false,
      username: false,
      password: null,
      email: null,
      error: null,
    });
    return;
  }

  if (error !== null) {
    res.json({
      signupSuccessful: false,
      username: null,
      password: true,
      email: null,
      error: error,
    });
    return;
  }

  let result = await db.emailExists(email);
  if (result.exists) {
    res.json({
      signupSuccessful: false,
      username: true,
      password: true,
      email: false,
      error: null,
    });
    return;
  }

  if (result.error) {
    res.josn({
      signupSuccessful: false,
      username: true,
      password: true,
      email: false,
      error: result.error,
    });
    return;
  }

  let { ok, _ } = await db.addUser({
    username: username,
    email: email,
    password: password,
  });

  res.json({
    signupSuccessful: ok,
    username: true,
    password: true,
    email: true,
    error: null,
  });
});

router.post("/login", async function (req, res) {
  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;
  let db = req.app.locals.databaseClient;

  let { exists, error } = await db.usernameExists(username);

  if (!exists) {
    res.json({
      loginSuccessful: false,
      username: false,
      password: null,
      error: null,
    });
    return;
  }

  if (error !== null) {
    res.json({
      loginSuccessful: false,
      username: null,
      error: error,
      password: null,
    });
    return;
  }

  let user = await db.getUserByUsername(username);
  if (password !== user.password) {
    res.json({
      loginSuccessful: false,
      username: true,
      password: false,
      error: null,
    });
    return;
  }

  res.json({
    loginSuccessful: true,
    username: true,
    password: true,
    error: null,
  });
});

module.exports = router;
