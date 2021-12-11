const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');


const app =express();
const port =process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqb56.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database = client.db('hotel');
    const servicesCollection = database.collection('services');
    const bookingsCollection = client.db('hotel').collection("bookings");
    const blogsCollection = database.collection('blogs');

    //GET API
    app.get('/services', async(req, res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
  });
  //get blogs
  app.get('/blogs', async(req, res)=>{
    const cursor = blogsCollection.find({});
    const blogs = await cursor.toArray();
    res.send(blogs);
});
  

  //Get single service
  app.get('/services/:id',async(req, res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const service = await servicesCollection.findOne(query);
    res.json(service);
  });

  
  // cofirm order
  app.post("/confirmOrder", async (req, res) => {
    const result = await bookingsCollection.insertOne(req.body);
    res.send(result);
    // console.log(result);
  });
  
//myorders
app.get("/myOrders/:email", async(req, res)=>{
  const result =await bookingsCollection.find({email: req.params.email})
  .toArray();
  res.send(result);

});


 /// delete order

 app.delete("/delteOrder/:id", async (req, res) => {
  const result = await bookingsCollection.deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
});

//    //DELETE API
   app.delete('/services/:id',async(req, res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.json(result);
  });

    //POST API
    app.post('/services',async(req, res)=>{
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      res.json(result);
     
    })
  }

 
   

finally{
  // await client.close()
}
}

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('backend server runing');
});

app.listen(port, ()=>{
    console.log('runing the backend server',port);
})