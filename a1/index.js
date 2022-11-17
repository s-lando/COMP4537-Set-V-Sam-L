const express = require("express");
const mongoose = require("mongoose");
// const { Schema } = mongoose;
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
} = require("./errorClasses");

const { asyncWrapper } = require("./asyncWrapper");
const { errorOverride } = require("./errorOverride");

const dotenv = require("dotenv");
dotenv.config();


const userModel = require("./userModel.js");
const {connectDB, getTypes, addPokemons} = require("./setupDB.js");

const app = express();

// const https = require("https");

app.use(express.json());

// let possibleTypes = [];
// let pokemonSchema = null;
// let pokemonModel = null;

const setupApp = asyncWrapper(async () => {

  await connectDB();
  const pokemonSchema = await getTypes();
  pokemonModel = await addPokemons(pokemonSchema);
  
  app.listen(process.env.PORT, async (error) => {

    if (error) {
      console.log(error);
    }
    console.log("Server is running on port", process.env.PORT);
  });

});
setupApp();

const bcrypt = require("bcrypt");

app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await userModel.create({
    username,
    password: hashedPassword,
    email
  })
  res.send(user)
}))

const jwt = require('jsonwebtoken');
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body

  // const appid = req.query.appid;
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonNotFoundError('User not found')
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    throw new PokemonBadRequest('Invalid password')
  }

  const token = jwt.sign({ role: user.role }, process.env.TOKEN_SECRET, { noTimestamp : true });

  //add token to db
  await userModel.updateOne({ _id: user
    ._id }, { $set: { token: token } });
    
  // res.header('auth-token', token)
  res.send(user)
}))

app.post('/logout', asyncWrapper(async (req, res) => {
  const { username } = req.body

  // const appid = req.query.appid;
  const user = await userModel.findOne
  ({ username })
  if (!user) {
    throw new PokemonNotFoundError('User not found')
  }

  //remove token from user
  await userModel.updateOne({ _id: user
    ._id }, { $set: { token: null } });
  res.send(user)

}))


// const { auth, adminAuth } = require('./authCheck');

const auth = async (req, res, next) => {
  const appid = req.query.appid;
  console.log(appid);

  let user = await userModel.findOne({token: appid});

  console.log(user);

  if (user == null) {
    throw new PokemonBadRequest("No user matches this token");
  }

  try {
    const verified = jwt.verify(appid, process.env.TOKEN_SECRET, { noTimestamp : true });
    console.log(verified);
    req.query.role = verified.role;
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}


app.use(asyncWrapper(auth));

// app.get("*", function (req, res) {
//   res.json({ msg: "404 - route not found" });
// });

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

  if (req.query.role != "admin") {
    throw new PokemonBadRequest("Error, you must be an admin to access this route");
  }


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
  if (req.query.role != "admin") {
    throw new PokemonBadRequest("Error, you must be an admin to access this route");
  }


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

  if (req.query.role != "admin") {
    throw new PokemonBadRequest("Error, you must be an admin to access this route");
  }


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

  if (req.query.role != "admin") {
    throw new PokemonBadRequest("Error, you must be an admin to access this route");
  }


  const id = req.params.id;

  // try {
    let result = await pokemonModel.deleteOne({ id: id });
    res.json({ result });
  // } catch (error) {
  //   res.json({ error });
  // }
}));

app.patch("/api/v1/pokemon/:id", asyncWrapper (async (req, res) => {
  if (req.query.role != "admin") {
    throw new PokemonBadRequest("Error, you must be an admin to access this route");
  }


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

app.use(errorOverride);
