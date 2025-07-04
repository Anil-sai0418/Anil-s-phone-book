const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors());


// database connection

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("data base is connected");

})
  .catch((err) => {
    console.error(err);

  })

// mongoose.Schema


const mageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    min: [5, 'number  must be at least 5'],
    max:[11,'number must be at least 11'],
    required: true
  }
}, { timestamps: true })

const productmodel = mongoose.model('products', mageSchema)

app.post('/product', (req, res) => {
  let anil = req.body;
  productmodel.create(anil)
  .then((document) => {
    console.log("user is registerd successfully")
    res.send({success : true ,  message: "phone number added successfully" })
  })
    .catch((err) => {
      console.log("some error" , err);
      res.status(500).send({success : false , message: "Server error" });
    })
})



// get route

app.get('/products', (req, res) => {
  productmodel.find()
    .then((products) => {
      res.send(products)
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "some error is comming" })

    })
})

// get route based on id

app.get('/product/:id', (req, res) => {
  
  productmodel.findById(req.params.id)
    .then((products) => {
      res.send(products)
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "some error is comming" })

    })
})

// delete route
app.delete("/product/:id",(req,res)=>{
  productmodel.deleteOne({_id:req.params.id})
  .then((info)=>{
    res.send({message:'it is deleted'})
    
  })
  .catch((err) => {
      console.log(err);
      res.send({ message: "some error is comming" })

    })
})




// put route
app.put('/product/:id',(req,res)=>{
  let product = req.body
  productmodel.updateOne ({_id:req.params.id},product)
    .then((info)=>{
      console.log(product);
      
    res.send({message:'produact is updated successfully'})
    
  })
  .catch((err) => {
      console.log(err);
      res.send({ message: "some error is comming" })

    })
})




app.listen(8000, () => {
  console.log("server is up and running on port number 8000");
});