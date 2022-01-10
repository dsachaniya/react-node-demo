/*
FileName : reservationCtrl.js
Description : This file consist of functions related to bikes reservations
*/

/* DEPENDENCIES */
const mongoose = require('mongoose');

const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse } = require('./../helpers/common');
const reservationsModal = require('../models/reservationsModal');
const bikesModal = require('../models/bikesModal');

/* Create new reservation */
module.exports.createReservation = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;
  if (!req.body.userId || !req.body.startTime || !req.body.endTime || !req.body.bikeId ) {
    SetResponse(rcResponse, 400, RequestErrorMsg('InvalidParams', req, null), false);
    httpStatus = 400;
  }

  try {
  var newStartTime = new Date(req.body.startTime);
  var newEndTime = new Date(req.body.endTime);
    let reservationObj = {
      userId: req.body.userId,
      startTime: newStartTime,
      endTime: newEndTime,
      bikeId: req.body.bikeId,
    };
    reservationObj = JSON.parse(JSON.stringify(reservationObj));

    const reservation = new reservationsModal(reservationObj);
    const reservationSave = await reservation.save();
    rcResponse.data = reservationSave;
  } catch (err) {
    if (err.code === 11000) {
      SetResponse(rcResponse, 400, RequestErrorMsg('BikeExists', req, null), false);
      httpStatus = 400;
    } else {
      SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
      httpStatus = 500;
    }
  }
  return res.status(httpStatus).send(rcResponse);
};

/* Update reservation detail */
module.exports.updateReservation = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    
    let reservationObj = {
        isCancelled: Boolean(req.body.isCancelled),
        rating: Number(req.body.rating),
    };
    reservationObj = JSON.parse(JSON.stringify(reservationObj));
    const updatedReservation = await reservationsModal.findOneAndUpdate({ _id: req.params.reservationId }, { $set: reservationObj }, { new: true }).lean().exec();
    
    if(req.body.rating) {
      const reservation = await reservationsModal.aggregate([
        { $match : { bikeId : updatedReservation.bikeId, rating: { $gte: 1 }} },
        {
          $group:
            {
              _id: "$reservation",
              avgRating: { $avg: "$rating" }
            }
        }
      ]).exec();
      await bikesModal.findOneAndUpdate({ _id: updatedReservation.bikeId }, { $set: {rating:reservation[0].avgRating} }, { new: true }).lean().exec();
    }
    rcResponse.data = updatedReservation;
    rcResponse.message = 'Reservation details has been updated successfully';
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};


/*  List of users by bike they reserved*/
module.exports.listOfUsers = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    const listOfUsers = await reservationsModal.aggregate([
      {
        $match: {
          bikeId: mongoose.Types.ObjectId(req.body.bikeId),
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userObj'
        }
      },
      {
        $unwind: '$userObj'
      },
      {
        $project: {
          _id:1,
          createdAt: 1,
          startTime:1,
          endTime:1,
          rating:1,
          isCancelled: 1,
          'userObj._id': 1,
          'userObj.firstName': 1,
          'userObj.lastName': 1,
          'userObj.email': 1,
          'userObj.phone': 1,
          'userObj.role': 1,
        }
      }
    ]).exec();
    rcResponse.data = listOfUsers;
    rcResponse.message = 'Users details has been fetched successfully';
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};


/*  List of bikes by user*/
module.exports.listOfBikes = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    const listOfUsers = await reservationsModal.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.body.userId),
        }
      },
      {
        $lookup: {
          from: 'bikes',
          localField: 'bikeId',
          foreignField: '_id',
          as: 'bikeObj'
        }
      },
      {
        $unwind: '$bikeObj'
      },
      {
        $project: {
          _id:1,
          createdAt: 1,
          startTime:1,
          endTime:1,
          rating:1,
          isCancelled: 1,
          'bikeObj._id': 1,
          'bikeObj.model': 1,
          'bikeObj.color': 1,
          'bikeObj.location': 1,
          'bikeObj.rating': 1,
          'bikeObj.available': 1,
        }
      }
    ]).exec();
    rcResponse.data = listOfUsers;
    rcResponse.message = 'Users details has been fetched successfully';
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};