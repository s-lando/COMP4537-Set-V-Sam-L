const { pokemonError } = require('./errorClasses.js');

const errorOverride = (err, req, res, next) => {
  if (err.statusCode == 400 || err.statusCode == 500) {
    res.status(err.statusCode);
    res.send(err.message);
  }
  else {
    res.status(500);
    res.send("Internal Server Error");
  }
}

module.exports = { errorOverride };
