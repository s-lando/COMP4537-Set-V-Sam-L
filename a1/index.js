const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

var cors = require('cors')
app.use(cors())

const https = require('https');

app.use(express.json())

app.listen(process.env.PORT || 5000 , async () => {
  try {
    await mongoose.connect('mongodb+srv://user01:test123@assignment.v6xmn9p.mongodb.net/db1?retryWrites=true&w=majority')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
  

  let possibleTypes = [];

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

  const pokemonSchema = new Schema({
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

  const pokemonModel = mongoose.model('pokemons', pokemonSchema);
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



app.get('/api/v1/pokemons?count=2%after=10', (req, res) => {
})



