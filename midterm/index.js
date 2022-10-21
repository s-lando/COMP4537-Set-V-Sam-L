const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000


const https = require('https');

app.use(express.json())

app.listen(5000, async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port 5000`)

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
   "type": {type: [String], enum: ["Grass", "Poison", "Fire", "Flying", "Water", "Bug", "Normal", "Electric", "Ground", "Fairy", "Fighting", "Psychic", "Rock", "Steel", "Ice", "Ghost", "Dragon"]},
});

const pokemonModel = mongoose.model('pokemons', pokemonSchema);

function update(pokemonLocal, pokemonFetched) {
  //updates the fetched with local

  Object.keys(pokemonLocal).forEach(key => {
    if (key != undefined && key != null) {
      if (key == "deleted" && key == true) {
        pokemonFetched = null;
        return pokemonFetched;
      }
      else  {
        pokemonFetched[key] = pokemonLocal[key];
      }
    }
  });
  return pokemonFetched;

}

app.get('/api/v1/pokemons', async (req, res) => {
  let count = req.query.count;
  let after = req.query.after;
  let pokemon = null;

  if (count == undefined || after == undefined) {
    res.json({ msg: "count and after query paramaters must be provided" });
    return;
  }

  await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json", async (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", async () => {
      pokemon = JSON.parse(data);
      //filter out the pokemon that are not in the range
      pokemon = pokemon.filter(p => p.id > after && p.id <= after + count);
      let pokemonsLocal = await pokemonModel.find({id: {$gt: after}});
      pokemon.forEach(p => {
        let pokemonLocal = pokemonsLocal.find(pLocal => pLocal.id == p.id);
        if (pokemonLocal != undefined) {
          pokemon[pokemon.indexOf(p)] = update(pokemonLocal, p);
        }
      res.json(pokemon);
    });
  });
});

});



app.get('/api/v1/pokemons/:id', async (req, res) => {
  let id = req.params.id;
  let pokemon = null;

  await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json", async (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      pokemon = JSON.parse(data);

    });
      let pokemonFound = pokemon.find(p => p.id == id);
      let localPokemon = await pokemonModel.findOne({id: id});

      if (localPokemon == null) {
        res.json(pokemonFound);
      } else {
      //filter out the pokemon that are not in the range
      pokemon = pokemon.filter(p => p.id == id);
      res.json(update(localPokemon, pokemonFound));
      }
  });
  });

app.post('/api/v1/pokemon', async (req, res) => {
  const body = req.body;
  const id = body.id;

  try {
    let pokemon = await pokemonModel.findOneAndUpdate({id: id}, body, {new: true, upsert: true});
    res.json({ msg: "pokemon updated", pokemon});
  } catch (error) {
    res.json({ msg: "pokemon not updated", error});
  }
});

app.get('/api/v1/pokemonImage/:id', async (req, res) => {

  const id = req.params.id;
  if (id < 1 || id > 809) {
    res.json({ msg: "id must be between 1 and 809 inclusive" });
    return;
  }

  const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" + id.padStart(3, "0") + ".png";

  res.json({ url: url });
})

app.put('/api/v1/pokemon/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    let pokemon = await pokemonModel.findOneAndUpdate({id: id}, body, {new: true, upsert: true});
    res.json({ msg: "pokemon updated", pokemon});
  } catch (error) {
    res.json({ msg: "pokemon not updated", error});
  }
});

app.delete('/api/v1/pokemon/:id', async (req, res) => {
  const id = req.params.id;
//mark as deleted
  const body = {deleted: true};

  try {
    let pokemon = await pokemonModel.findOneAndUpdate({id: id}, body, {new: true, upsert: true});
    res.json({ msg: "pokemon deleted"});
  } catch (error) {
    res.json({ msg: "pokemon not updated", error});
  }
});















      













  