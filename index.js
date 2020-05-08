const express = require("express");
const MongoClient = require('mongodb').MongoClient;
let collectionArray = [];

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("HTML shell"));
    app.set("view engine", "ejs");


const uri = "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(async err => {
  
  const collection = client.db("game").collection("users");
  let x = collection.find().toArray(function(err, docs) {
    console.log(docs);
   collectionArray.push(docs); 
  });
});

app.get("/leaderboard", (req, res) => {
  res.render("leaderboard", {userArray: collectionArray});
})

app.listen(4000);