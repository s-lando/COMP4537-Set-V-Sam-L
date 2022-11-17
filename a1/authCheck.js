const { PokemonBadRequest } = require("./errorClasses");
const jwt = require('jsonwebtoken');
const userModel = require("./userModel.js");

const auth = async (req, res, next) => {
  const appid = req.query.appid;
  console.log(appid);

  await userModel.findOne({token: appid}, (err, user) => {

    userModel.findOne({token: appid}, (err, user) => {
      if (!user) {
        throw new PokemonBadRequest('Could not find user with that token');
      }
      next();
    })
  })

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