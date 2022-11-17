const { PokemonBadRequest } = require("./errorClasses");
const jwt = require('jsonwebtoken');
const userModel = require("./userModel.js");

const auth = async (req, res, next) => {
  const appid = req.query.appid;
  console.log(appid);

  let user = await userModel.findOne({appid: appid});

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


const adminAuth = (req, res, next) => {
  const appid = req.query.appid;
  try {
    const verified = jwt.verify(appid, process.env.TOKEN_SECRET, { noTimestamp : true });

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