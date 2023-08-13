const express = require('express')
const { MongoClient } = require('mongodb');
// const {PORT}  = require('dotenv')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')



app.use(cors())
app.use(express.json())


const url = "mongodb+srv://restaurantbooking:root@cluster0.cbkcrne.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });




app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/api', async (req, res) => {
    try {
        const collection = client.db('Restaurants').collection('RestaurantsList');
        const allData = await collection.find({}).toArray();

        res.send(allData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

app.get(`/fetchDetails/:id`, async (req, res) => {
    const {id} = req.params
    try {
        let receivedData = new ObjectId(id)  
        const collection = client.db('Restaurants').collection('RestaurantsList');
        const allData = await collection.find({"_id" : receivedData}).toArray();
        res.send(allData[0]._id);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

app.post('/login', async (req, res) => {

    try {
        const receivedData = req.body; // This will contain the data sent from Angular
        console.log(receivedData)
        const collection1 = client.db('UserDetails').collection('UserManagement');
        const allData = await collection1.find({ "$or": [{ "mobile": receivedData.mobile }, { "email": receivedData.mobile },{"password":receivedData.password}] }).toArray();
        console.log(allData)
        if (allData.length > 0) {
            if (allData[0].mobile == receivedData.mobile || allData[0].email === receivedData.mobile) {
                if (allData[0].password === receivedData.password) {
                    let data = receivedData.mobile
                    let token = jwt.sign(data, 'myToken')
                    res.send({token:token,allData})
                } else {
                    res.status(403).json({ message: 'Incorrect passoword' })
                }
            }else{
                res.status(403).json({message:"Incorrect Email or Mobile"})
            }
        }
        else {
            res.status(403).json({ message: 'No user Found' })
        }
    }
    catch (error) {
        console.log(error)
    }
})

app.post('/register', async (req, res) => {

    try {
        const receivedData = req.body; // This will contain the data sent from Angular
        const collection1 = client.db('UserDetails').collection('UserManagement');
        const allData = await collection1.find({ "$or": [{ "mobile": receivedData.mobile }, { "email": receivedData.email }] }).toArray();
        if (allData.length == 0) {
            collection1.insertOne({
                "username": receivedData.username, "email": receivedData.email,
                "password": receivedData.password, "mobile": receivedData.mobile, "alt mobile": receivedData.altMobile,
                "address": {
                    "door no": receivedData.doorNo,
                    "street": receivedData.street,
                    "mandal": receivedData.mandal,
                    "city": receivedData.city,
                    "pincode": receivedData.pincode
                },
                "orders": []
            })
            res.send("account created")
        } else {
            res.status(409)
            res.send('email or mobile is already registered')
        }

    }
    catch (error) {
        console.log(error)
    }
})

app.post('/RestuarantList', async (req, res) => {
    try {
        const collection = client.db('Restaurants').collection('RestaurantsList');
        const restList = await collection.insertOne({
            "Name": "Helapuri Restuarant",
            "Food items": [{ "item": "Veg Fried rice", "Favourites": false }, { "item": "Chicken Fried rice", "Favourites": false }, { "item": "Chilli Chicken", "Favourites": false }, { "item": "Chicken Manchurian", "Favourites": false }],
            "Availability": true
        }
        )
        res.send(restList)
        console.log(restList)
    }
    catch (error) {
        console.log(error);
    }
});

app.put('/updateList', async (req, res) => {
    try {
        const collection = client.db('Restaurants').collection('RestaurantsList');
        const restList = await collection.updateMany({
            "Name": "Cascades"
        },
            { $set: { "Food items": [{ "item": "Veg Fried rice", "Favourites": false, "Cost": 200 }, { "item": "Chicken Fried rice", "Favourites": false, "Cost": 300 }, { "item": "Chilli Chicken", "Favourites": false, "Cost": 250 }, { "item": "Chicken Manchurian", "Favourites": false, "Cost": 200 }] } }
        )
        res.send(restList)
        console.log(restList)
    }
    catch (error) {
        console.log(error);
    }
});

app.put('/updateOrder', async (req, res) => {
    try {
        let receivedData = req.body
        const collection = client.db('UserDetails').collection('UserManagement');
        console.log(receivedData.orders)
        let receivedData1 = new ObjectId(receivedData.id)
        const restList = await collection.updateOne({
            "_id": receivedData1
        },
            { $push: { "orders": receivedData.orders } }
        )
        res.send(restList)
    }
    catch (error) {
        console.log(error);
    }
});

app.delete('/deleteList', async (req, res) => {
    try {
        const collection = client.db('Restaurants').collection('RestaurantsList');
        const allData = await collection.deleteMany({
            "name": "Alpha"
        });

        res.send(allData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

app.listen(5000, async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        console.log("http://localhost:5000")
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})