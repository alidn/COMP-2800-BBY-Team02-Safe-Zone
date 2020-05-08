
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://zas:zastv@cluster0-vztfn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("game").collection("users");
  
  client.close();
});
