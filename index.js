
const express = require("express");
const MongoClient = require('mongodb').MongoClient;
let collectionArray = [];

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("HTML shell"));
app.use(express.static("images"));
app.use(express.static("styling"));
app.set("view engine", "ejs");

app.use(express.json());

const uri = "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(async err => {
  const collection = client.db("game").collection("users");
  app.locals.collection = collection;
  let x = collection.find().toArray(function (err, docs) {
    collectionArray = docs;
  });
  app.listen(4000);
});


app.get("/leaderboard", (req, res) => {
  sortScores();
  res.render("leaderboard", { userArray: collectionArray });
})

app.get("/myAccount", (req, res) => {
  res.render("myAccount")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/signup", (req, res) => {
  // console.log(req.body);
  // console.log(req.body.emailInput);
  // console.log(req.body.usernameInput);
  // console.log(req.body.passwordInput);
  let userColl = app.locals.collection;
  let x = userColl.find().toArray(function (err, docs) {

    //Loop through all users
    for (let i = 0; i < docs.length; i++) {
      //Check to see if form data already exists in db
      if (docs[i].username == req.body.usernameInput) {
        res.json({ success: false, error: "Username already exists." })
        return;
      }
      //Check to see if form data already exists in db
      if (docs[i].email == req.body.emailInput) {
        res.json({ success: false, error: "Email already exsits." })
        return;
      }
    }
    userColl.insertOne({
      username: req.body.usernameInput,
      password: req.body.passwordInput,
      email: req.body.emailInput,
      scores: [],
      friendsList: []
    })
    res.json({ success: true })
    res.render("views/myAccount")
  });


});

app.post("/myAccount", async (req, res) => {
  if (req.body.submit === 'ADD FRIEND') {
    console.log("Here " + req.body.friendID);
    let userColl = app.locals.collection;
    let user = await userColl.findOne({ username: req.body.friendID })

    if (user) {
      //add friendID to freindsList if its not already there 
      console.log("        we are herewegqewrgqewgqwerg");

      try {
        userColl.updateOne(
          { "username": "some_user" },
          {  $push: { "friendsList": req.body.friendID } },
        );
      } catch (e) {
        print(e);
      }
    } else if (user === null) {
      //alert that the usre doesnt exist in teh database
    }
  } else if (req.body.submit === 'REMOVE FRIEND') {

  } else {
    let userColl = app.locals.collection;
    let user = await userColl.findOne({ username: req.body.username })
    // console.log(user);
    res.json(user)
  }

})

app.post("/signin", (req, res) => {

  // console.log(req.body);
  // console.log(req.body.usernameInput);
  // console.log(req.body.passwordInput);
  let userColl = app.locals.collection;
  let x = userColl.find().toArray(function (err, docs) {

    //Loop through all users
    for (let i = 0; i < docs.length; i++) {
      //Check to see if form data already exists in db
      if (docs[i].username == req.body.usernameInput && docs[i].password == req.body.passwordInput) {
        res.json({ success: true })
        return;
      }
    }
    res.json({ success: false, error: "Account not found!" })

  });
})



//This function will go through every user and sort the scores from highest to lowerst 
function sortScores() {
  console.log(collectionArray)
  for (let i = 0; i < collectionArray.length; i++) {

    collectionArray[i].scores.sort((a, b) => {
      if (b.scores && a.scores) {
        return (b.score > a.score) ? 1 : -1
      } else if (a.scores && !b.scores) {
        return -1;
      } else if (b.scores && !a.scores) {
        return 1;
      } else {
        return 1
      }
    });
  }
  collectionArray.sort((a, b) => {
    if (b.scores.length && a.scores.length) {
      return b.scores[0].score > a.scores[0].score ? 1 : -1
    } else if (a.scores.length && !b.scores.length) {
      return -1;
    } else if (b.scores.length && !a.scores.length) {
      return 1;
    } else {
      return -1
    }
  }); // sorts users collection by the highest scores.
}


