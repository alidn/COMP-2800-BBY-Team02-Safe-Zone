const express = require("express");
const MongoClient = require('mongodb').MongoClient;

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("HTML shell"));
    app.set("view engine", "ejs");


const uri = "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  // const collection = client.db("game").collection("users");
  
  client.close();
});


app.get("/leaderboard", (req, res) => {
  collection = [
    {
      id: 1,
      score: 10,
      time:1.5
    },
    {
      id: 2,
      score: 15,
      time:2.3
    },
    {
      id: 3,
      score: 20,
      time:2.5
    },
    {
      id: 4,
      score: 1254,
      time:6.3
    }
  ]
  res.render("leaderboard", {userArray:collection});
})

app.listen(4000);