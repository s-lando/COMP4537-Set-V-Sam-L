const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

app.listen(port, async () => {
  try {
    await mongoose.connect('mongodb+srv://user1:test123@cluster0.fltpsua.mongodb.net/test?retryWrites=true&w=majority')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
}
)


const { Schema } = mongoose;

const unicornSchema = new Schema({
  "name": String, // String is shorthand for {type: String}
  "weight": Number,
  "loves": [String],
  'gender': {type: String, enum: ['f', 'm']},
  "vampires": Number,
  "dob": Date
});

const unicornModel = mongoose.model('unicorns', unicornSchema); // unicorns is the name of the collection in db

app.get('/api/v2/unicorns', (req, res) => {
  unicornModel.find({})
    .then(docs => {
      console.log(docs)
      res.json(docs)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
  // res.json(unicornsJSON)
})

app.get('/api/v2/unicorn/:id', (req, res) => {

  console.log(req.params.id);
  unicornModel.find({ _id: mongoose.Types.ObjectId(`${req.params.id}`) })
    .then(doc => {
      console.log(doc)
      res.json(doc)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
})


