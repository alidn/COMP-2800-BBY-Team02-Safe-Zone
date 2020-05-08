const express = require("express");
const MongoClient = require('mongodb').MongoClient;

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("HTML shell"));
    app.set("view engine", "ejs");


const uri = "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  console.log(err);
});


app.get("leaderboard", (req, res) => {
  const collection = client.db("game").collection("users");
  res.render("views/leaderboard.ejs", collection);
})
