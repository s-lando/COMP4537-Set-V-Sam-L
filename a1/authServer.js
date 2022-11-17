const express = require("express");
// const mongoose = require("mongoose");
// const { Schema } = mongoose;
const {
  PokemonBadRequest,
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

const setupAuth = asyncWrapper(async () => {

  await connectDB();
  // pokemonModel = await addPokemons(pokemonSchema);
  
  app.listen(process.env.AUTH_PORT, async (error) => {

    if (error) {
      console.log(error);
    }
    console.log("Server is running on port", process.env.AUTH_PORT);
  });

});
setupAuth();

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

app.use(errorOverride);
