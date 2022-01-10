/*
FileName : reservationsModal.js
Description : This file consist of model fields
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bikes' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  startTime: {type: Date, required:true},
  endTime: {type: Date, required:true},
  rating: {type:Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false },
  isCancelled: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reservations', reservationSchema);