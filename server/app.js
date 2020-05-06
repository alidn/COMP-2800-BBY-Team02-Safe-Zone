const express = require("express");
const { DatabaseClient } = require("../database/user");

const app = express();
const port = 3000;

app.use(require("./routes/user"));

new DatabaseClient().then((db) => {
  app.locals.databaseClient = db;
  console.log("connected to the database");
  app.listen(port, () => console.log(`app listening at port ${port}`));
});
