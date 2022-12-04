const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3,
    max: 20
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 1000,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      min: 3
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
})

module.exports = mongoose.model('users', schema)
