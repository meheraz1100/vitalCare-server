const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://vitalcareadmin:HCS2kZzfw7NKtLsc@cluster0.bgw1n6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const servicesCollection = client.db('vitalcare').collection('services_name');


    app.get('/services', async(req, res) => {
        const cursor = await servicesCollection.find().toArray();
        res.send(cursor);
    })


    app.post('/addService', async (req, res) => {
      const newService = req.body;
      console.log(newService);
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
  })

  // app.delete('/services/:id', async(req, res) => {
  //   const id = req.params.id;
  //   const query = { _id: id}
  //   const result = await servicesCollection.deleteOne(query);
  //   res.send(result);
  // })

  app.delete('/services/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await servicesCollection.deleteOne(query);
    res.send(result);
  })


  app.get('/services/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await servicesCollection.findOne(query);
    res.send(result);
  })


  app.put('/services/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const updatedService = req.body;
    const service = {
      $set: {
        name: updatedService.name,
        description: updatedService.description ,
        price: updatedService.price
      }
    }
    const result = await servicesCollection.updateOne(filter, service);
    res.send(result);
  })

    



















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('vitalcare is running');
})


app.listen(port, () => {
    console.log(`vitalcare is running on ${port}`)
})
