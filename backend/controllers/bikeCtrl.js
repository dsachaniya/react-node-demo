/*
FileName : bikeCtrl.js
Description : This file consist of functions related to bikes
*/

/* DEPENDENCIES */
const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse } = require('./../helpers/common');
const bikesModal = require('./../models/bikesModal');
const usersModel = require('./../models/usersModel');
const mongoose = require('mongoose');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/* Create new bike */
module.exports.createBike = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;
  const { decoded } = req;
  if (!req.body.model || !req.body.color || !req.body.location ) {
    SetResponse(rcResponse, 400, RequestErrorMsg('InvalidParams', req, null), false);
    httpStatus = 400;
  }

   

  try {
    let bikeObj = {
        model: req.body.model,
        color: req.body.color,
        location: req.body.location,
    };
    bikeObj = JSON.parse(JSON.stringify(bikeObj));

    const bike = new bikesModal(bikeObj);
    const bikeSave = await bike.save();
    rcResponse.data = bikeSave;
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

/* Get details of the Bike */
module.exports.getBikeDetails = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    const bikeDetails = await bikesModal.findOne({ _id: req.params.bikeId }).lean().exec();
    rcResponse.data = bikeDetails;
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};

/* Update Bike details */
module.exports.updateBikeDetails = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    let bikeObj = {
        model: req.body.model,
        color: req.body.color,
        location: req.body.location,
    };

    bikeObj = JSON.parse(JSON.stringify(bikeObj));
    const updatedBike = await bikesModal.findOneAndUpdate({ _id: req.params.bikeId }, { $set: bikeObj }, { new: true }).lean().exec();
    rcResponse.data = updatedBike;
    rcResponse.message = 'Bike details has been updated successfully';
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};

/* Delete a Bike */
module.exports.deleteBike = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    const deleteBike = await bikesModal.update({ _id: req.params.bikeId }, { $set: { deleted: true } }).lean().exec();
    if (deleteBike.nModified) {
      rcResponse.message = 'Bike has been deleted successfully';
    } else {
      httpStatus = 400;
      rcResponse.message = 'No Bike found with this id';
    }
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};


/* Get list of available Bikes */
module.exports.getAvailableBikes = async (req, res) => {
    /* Contruct response object */
    let rcResponse = new ApiResponse();
    let httpStatus = 200;

    try {
      const bikeDetails = await bikesModal.aggregate([
        {
          $match: {
            available: true,
            deleted: false
          }
        }
          ]);
      rcResponse.data = bikeDetails;
    } catch (err) {
      SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
      httpStatus = 500;
    }
    return res.status(httpStatus).send(rcResponse);
  };