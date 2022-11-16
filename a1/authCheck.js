const { PokemonBadRequest } = require("./errorClasses");

const auth = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) 
    throw new PokemonBadRequest("You must be signed in to access this resource");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}

module.exports = { auth };