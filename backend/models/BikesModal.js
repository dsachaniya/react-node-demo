/*
FileName : bikesModal.js
Description : This file consist of model fields
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  model: { type: String, required: true ,unique: false},
  color: { type: String,  required: true ,unique: false },
  location: { type: String, required: true , unique: false},
  rating: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false }
});

bikeSchema.index({ model: 1, color: 1, location: 1}, { unique: true });

module.exports = mongoose.model('Bikes', bikeSchema);