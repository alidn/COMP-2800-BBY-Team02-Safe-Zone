const express = require("express");

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.set("view engine", "ejs");


app.get("/", (req, res)=> res.render("pages/index"));

app.listen(3000);