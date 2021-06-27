const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortenUrlSchema = new Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('ShortenUrl', shortenUrlSchema)