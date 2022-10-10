const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

var cors = require('cors')
app.use(cors())

const https = require('https');


app.use(express.json())

let possibleTypes = [];
let pokemonSchema = null;
let pokemonModel = null;

app.listen( 5000 , async () => {
  try {
    await mongoose.connect('mongodb+srv://user01:test123@assignment.v6xmn9p.mongodb.net/db1?retryWrites=true&w=majority')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
  

  

  await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json", async (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      let jsonTypes = JSON.parse(data);
      console.log(jsonTypes);
      jsonTypes.forEach(type => {
        possibleTypes.push(type.english);
      });
      console.log(possibleTypes);

    });
  });

  const { Schema } = mongoose;

  pokemonSchema = new Schema({
    "base": {
       "HP": Number,
        "Attack": Number, 
        "Defense": Number, 
        "Sp. Attack": Number, 
        "Sp. Defense": Number, 
        "Speed": Number 
      },
      "id": {type: Number, unique: true},
      "name": {
        "english": {type: String, maxlength: 20},
        "japanese": String,
        "chinese": String,
        "french": String
      },
      "type": {type: [String], enum: possibleTypes},
  });

  pokemonModel = mongoose.model('pokemons', pokemonSchema);
  await pokemonModel.deleteMany({}).then(() => {
    console.log("deleted all");
  });


  await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json", async (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      // console.log(JSON.parse(data));
      let pokemon = JSON.parse(data);
      pokemon.forEach(async (p) => {
        await pokemonModel.create(p);
      });
  })


  });

})

// app.get('/api/v2/pokemons', (req, res) => {
//   pokemonModel.find({})
//     .then(docs => {
//       console.log(docs)
//       res.json(docs)
//     })
//     .catch(err => {
//       console.error(err)
//       res.json({ msg: "db reading .. err.  Check with server devs" })
//     })
// })



app.get('/api/v1/pokemons', async (req, res) => {

  let count = req.query.count;
  let after = req.query.after;

  if (count == undefined || after == undefined) {
    res.json({ msg: "count and after query paramaters must be provided" });
    return;
  }

  try {
  let pokemons = await pokemonModel.find({id: {$gt: after}});

  pokemons = pokemons.slice(0, count);

  res.json(pokemons);
  } catch (error) {
    console.log(error);
    res.json({ msg: "db reading err - ensure your queries are correct" })
  }
})

app.get('/api/v1/pokemon/:id', async (req, res) => {
  const id = req.params.id;
  if (id < 1 || id > 809) {
    res.json({ msg: "id must be between 1 and 809. You submitted: " + id });
    return;
  }

  try {
    let pokemon = await pokemonModel.findOne({id: id});
    res.json(pokemon);
  }
  catch (error) {
    res.json({ msg: "could not find pokemon with id: " + id + " ensure you are passing a number between 1 and 809" });

  }
})

app.get('/api/v1/pokemonImage/:id', async (req, res) => {

  const id = req.params.id;
  if (id < 1 || id > 809) {
    res.json({ msg: "id must be between 1 and 809" });
    return;
  }

  const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" + id.padStart(3, "0") + ".png";

  res.json({ url: url });
})

app.post('/api/v1/pokemon', async (req, res) => {
  const body = req.body;
  try {
    let pokemon = await pokemonModel.create(body);
    res.json({ msg: "pokemon created: ", pokemon });
  }
  catch (error) {
    res.json({ msg: error });
  }
})

app.put('/api/v1/pokemon/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    let pokemon = await pokemonModel.findOneAndUpdate({id: id}, body);
    res.json({ msg: "pokemon updated: ", body });
  }
  catch (error) {
    res.json({ error });
  }
})

app.delete('/api/v1/pokemon/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    let result = await pokemonModel.deleteOne({id: id});
    res.json({  result });
  }
  catch (error) {
    res.json({ error });
  }
})





