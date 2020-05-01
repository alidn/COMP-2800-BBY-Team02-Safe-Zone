const { DatabaseClient } = require("./user");

async function exampleAddUser() {
  let database = await new DatabaseClient();
  const { error } = await database.addUser({
    username: "Zas",
    email: "Zas@gmail.com",
    password: "Zastv",
  });

  if (error !== null) {
    console.log(error);
  } else {
    console.log("Added user");
  }
}

async function exampleCheckUsernameExist() {
  let database = await new DatabaseClient();
  const { exists, error } = await database.usernameExists("Zas");
  if (error) {
    console.log(error);
  } else {
    console.log(`exists: ${exists}`);
  }
}

async function exampleCheckTopScores() {
  let database = await new DatabaseClient();
  const { scores, error } = await database.topScores("Zas");
  if (error) {
    console.log(error);
  } else {
    console.log(`scores: ${JSON.stringify(scores, null, 2)}`);
  }
}

async function exampleAddScore() {
  let database = await new DatabaseClient();
  let result = await database.addScore("Zas", 5);
  if (result.error) {
    console.log("error adding score: " + result.error);
  }
  result = await database.addScore("Zas", 14);
  if (result.error) {
    console.log("error adding score: " + result.error);
  }
  result = await database.addScore("Zas", 17);
  if (result.error) {
    console.log("error adding score: " + result.error);
  }
  result = await database.addScore("Zas", 21);
  if (result.error) {
    console.log("error adding score: " + result.error);
  }
  result = await database.addScore("Zas", 0);
  if (result.error) {
    console.log("error adding score: " + result.error);
  }
}

(async () => {
  await exampleAddUser();
  await exampleAddScore();
  await exampleCheckTopScores();
  console.log("Done!");
})();
