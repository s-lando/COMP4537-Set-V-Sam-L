const express = require("express");
const mongoose = require("mongoose");
import {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
} from "./errorClasses.js";

import { asyncWrapper } from "./asyncWrapper.js";
import errorOverride, { overrideError } from "./errorOverride.js";
const app = express();
const port = 5000;

const https = require("https");

app.use(express.json());

let possibleTypes = [];
let pokemonSchema = null;
let pokemonModel = null;

const setupApp = asyncWrapper(async () => {
  app.listen(process.env.PORT || 5000, async (error) => {
      await mongoose.connect(
        "mongodb+srv://user01:test123@assignment.v6xmn9p.mongodb.net/db1?retryWrites=true&w=majority"
      );
     if (error) {
      throw new PokemonDbError(error.messsage);
    }
    console.log(`Example app listening on port ${port}`);

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

    const { Schema } = mongoose;

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
          // console.log(JSON.parse(data));
          let pokemon = JSON.parse(data);
          pokemon.forEach(async (p) => {
            await pokemonModel.create(p);
          });
        });
      }
    );
  });
});

setupApp();

app.get("/api/v1/pokemons", asyncWrapper (async (req, res) => {
  let count = req.query.count;
  let after = req.query.after;

  if (count == undefined || after == undefined) {
    // res.json({ msg: "count and after query paramaters must be provided" });
    throw new PokemonBadRequestMissingID("Bad Request, count and after query paramaters must be provided");
    
  }

  // try {
    let pokemons = await pokemonModel.find({ id: { $gt: after } });

    pokemons = pokemons.slice(0, count);

    res.json(pokemons);
  // } catch (error) {
  //   console.log(error);
  //   res.json({ msg: "db reading err - ensure your queries are correct" });
  // }
}));


app.get("/api/v1/pokemon/:id", asyncWrapper (async (req, res) => {
  const id = req.params.id;

  if (id == undefined) {
    throw new PokemonBadRequestMissingID("Bad Request, id query paramater must be provided");
    
  }

  // try {
    let pokemon = await pokemonModel.findOne({ id: id });

    if (pokemon == null) {
      throw new PokemonNotFoundError("Pokemon not found");
    }
    res.json(pokemon);


  // } catch (error) {
  //   res.json({
  //     msg:
  //       "could not find pokemon with id: " +
  //       id +
  //       ", ensure you are passing a valid number.",
  //   });
  // }
})
);

app.get("/api/v1/pokemonImage/:id", asyncWrapper (async (req, res) => {
  const id = req.params.id;
  if (id < 1 || id > 809) {
    // res.json({ msg: "id must be between 1 and 809 inclusive" });
    // return;
    throw new PokemonBadRequest("Bad Request, id must be between 1 and 809 inclusive");
  }

  const url =
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" +
    id.padStart(3, "0") +
    ".png";

  res.json({ url: url });
}));

app.post("/api/v1/pokemon", asyncWrapper  (async (req, res) => {
  const body = req.body;
  if (body == undefined || body == null) {
    throw new PokemonBadRequest("Bad Request, body must be provided with id parameter");
  }
  // try {
    let pokemon = await pokemonModel.create(body);
    res.json({ msg: "pokemon created: ", pokemon });
  // } catch (error) {
  //   res.json({ error });
  // }
}));

app.put("/api/v1/pokemon/:id", asyncWrapper (async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  // try {
    let pokemon = await pokemonModel.findOneAndUpdate({ id: id }, body, {
      new: true,
      upsert: true,
    });
    res.json({ msg: "pokemon upserted: ", pokemon });
  // } catch (error) {
  //   res.json({ error });
  // }
}));

app.delete("/api/v1/pokemon/:id", asyncWrapper (async (req, res) => {
  const id = req.params.id;

  // try {
    let result = await pokemonModel.deleteOne({ id: id });
    res.json({ result });
  // } catch (error) {
  //   res.json({ error });
  // }
}));

app.patch("/api/v1/pokemon/:id", asyncWrapper (async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  // try {
    let pokemon = await pokemonModel.updateOne({ id: id }, body);

    if (pokemon.matchedCount == 0) {
      
      throw new PokemonNotFoundError("Pokemon with id" + id + " not found");
    } 
      res.json({ msg: "pokemon updated: ", pokemon });
    
  // } catch (error) {
  //   res.json({ error });
  // }
}));

app.get("*", function (req, res) {
  res.json({ msg: "404 - route not found" });
});

app.use(errorOverride);
