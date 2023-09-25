const express = require('express')
const { MongoClient } = require('mongodb');
// const {PORT}  = require('dotenv')
const cors = require('cors')
const app = express();




app.use(cors())
app.use(express.json())


const url = "mongodb+srv://restaurantbooking:root@cluster0.cbkcrne.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });




require("./RestRoute")(app);

app.listen(4000, async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        console.log("http://localhost:4000")
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})