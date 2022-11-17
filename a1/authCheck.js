const { PokemonBadRequest } = require("./errorClasses");
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const appid = req.query.appid;
  console.log(appid);
  // const token = req.header('auth-token');
  // if (!token) 


  //   throw new PokemonBadRequest(appid + " is not a valid appid");

  try {
    const verified = jwt.verify(appid, process.env.TOKEN_SECRET, { noTimestamp : true });
    console.log(verified);
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}

const adminAuth = (req, res, next) => {
  const appid = req.query.appid;
  try {
    const verified = jwt.verify(appid, process.env.ADMIN_SECRET, { noTimestamp : true });

    if (verified.role == 'admin') {
      console.log('admin verified');
    }
    else {
      throw new PokemonBadRequest('User must be admin to access this route');
    }
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}

module.exports = { auth, adminAuth };