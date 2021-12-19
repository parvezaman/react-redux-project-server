const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();

// middleware setup
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;

//MoingoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbuol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("hire-a-book");
      const test = database.collection("test");
      const allBooksCollection = database.collection("allBooks");
  
      //GET API (To get all books from database to the server)
      app.get("/allbooks", async(req, res)=>{
        const cursor = allBooksCollection.find({});
        const allBooks = await cursor.toArray();
        res.send(allBooks);
      })
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
  
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })