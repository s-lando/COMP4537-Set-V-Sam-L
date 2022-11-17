const { PokemonBadRequest } = require("./errorClasses");
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const appid = req.query.appid;
  // const token = req.header('auth-token');
  // if (!token) 


  //   throw new PokemonBadRequest(appid + " is not a valid appid");

  try {
    const verified = jwt.verify(appid, process.env.TOKEN_SECRET, { noTimestamp : true });
    req.user = verified;
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}

module.exports = { auth };