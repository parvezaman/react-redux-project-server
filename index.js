const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


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
        const testShippingAddressCollection = database.collection("testShippingAddress");

        //GET API (To get all books from database to the server)
        app.get("/allbooks", async (req, res) => {
            const cursor = allBooksCollection.find({});
            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });

        //   Get individual book by id
        app.get('/allbooks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleBook = await allBooksCollection.findOne(query);
            res.send(singleBook);
        });

        // Post shipping address 
        app.post('/testshipping', async(req, res)=>{
            const address = req.body;
            const result = await testShippingAddressCollection.insertOne(address);
            res.json(result);
        });

        // Get all orders
        app.get('/orders', async(req, res)=>{
            const cursor = testShippingAddressCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
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