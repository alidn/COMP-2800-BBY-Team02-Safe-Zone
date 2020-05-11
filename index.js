const express = require("express");
const MongoClient = require("mongodb").MongoClient;
let collectionArray = [];

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("HTML shell"));
app.set("view engine", "ejs");

const uri =
  "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(async (err) => {
  const collection = client.db("game").collection("users");
  let x = collection.find().toArray(function (err, docs) {
    collectionArray = docs;
  });
});

app.get("/leaderboard", (req, res) => {
  sortScores();
  res.render("leaderboard", { userArray: collectionArray });
});

app.listen(process.env.PORT || 4000);

//This function will go through every user and sort the scores from highest to lowerst
function sortScores() {
  for (let i = 0; i < collectionArray.length; i++) {
    collectionArray[i].scores.sort((a, b) => (b.score > a.score ? 1 : -1));
  }
  collectionArray.sort((a, b) =>
    b.scores[0].score > a.scores[0].score ? 1 : -1
  ); // sorts users collection by the highest scores.
}
