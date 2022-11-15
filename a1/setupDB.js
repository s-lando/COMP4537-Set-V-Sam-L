const mongoose = require("mongoose");
const https = require("https");
const { Schema } = mongoose;

const connectDB = async () => {

    try {
    await mongoose.connect(process.env.MONGO_STRING);
    // mongoose.connection.db.dropDatabase();
    } catch (error) {
    throw new PokemonDbError(error.messsage);
  }
}

const getTypes = async () => {

  let possibleTypes = [];

  https.get(
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json",
    async (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let jsonTypes = JSON.parse(data);
        console.log(jsonTypes);
        jsonTypes.forEach((type) => {
          possibleTypes.push(type.english);
        });
        console.log(possibleTypes);
      });
    }
  );

  pokemonSchema = new Schema({
    base: {
      HP: Number,
      Attack: Number,
      Defense: Number,
      "Sp. Attack": Number,
      "Sp. Defense": Number,
      Speed: Number,
    },
    id: { type: Number, unique: true },
    name: {
      english: { type: String, maxlength: 20 },
      japanese: String,
      chinese: String,
      french: String,
    },
    type: { type: [String], enum: possibleTypes },
  });

  return pokemonSchema;

}

const addPokemons = async (pokemonSchema) => {

  pokemonModel = mongoose.model("pokemons", pokemonSchema);
  await pokemonModel.deleteMany({}).then(() => {
    console.log("deleted all");
  });

  await https.get(
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json",
    async (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let jsonPokemons = JSON.parse(data);
        console.log(jsonPokemons);
        jsonPokemons.forEach((pokemon) => {
          pokemonModel.create(pokemon);
        });
      });
    }
  );

  return pokemonModel;

}

module.exports = { connectDB, getTypes, addPokemons };
  