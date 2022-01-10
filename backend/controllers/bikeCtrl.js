/*
FileName : bikeCtrl.js
Description : This file consist of functions related to bikes
*/

/* DEPENDENCIES */
const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse } = require('./../helpers/common');
const bikesModal = require('./../models/bikesModal');
const mongoose = require('mongoose');
const reservationsModal = require('../models/reservationsModal');
const bikeData = require('../helpers/bike-data.json');

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
    const deleteBike = await bikesModal.findOneAndUpdate({ _id: req.params.bikeId }, { $set: { deleted: true } }).lean().exec();
    await reservationsModal.updateMany({ bikeId: req.params.bikeId }, { $set: {
      deleted: true
    } }, { new: true, runValidators: true }).lean().exec();
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

  /* Get list of all Bikes */
module.exports.listAllBikes = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  try {
    const bikeDetails = await bikesModal.aggregate([
      {
        $match: {
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

const getClashedReseravtionsForDateRange = async (startDate, endDate) => {
  const reservations = await reservationsModal.aggregate([
      {
          $match: {
              $or: [
                  { "startTime": { "$gte": new Date(startDate), "$lte": new Date(endDate) } },
                  { "endTime": { "$gte": new Date(startDate), "$lte": new Date(endDate) } },
              ]
          }
      },
  ])

  return reservations.length ? reservations.map(reservation => (reservation.bikeId)) :  [];
}

const getQuery = ({excludedIds, model = [], color = [], location = [], available, rating}) => {
  const ObjectId = mongoose.Types.ObjectId;
  const query = {
    deleted: false
  }
  if (model.length) {
      query.model = {$in:  model }
  }
  if (excludedIds) {
      query._id = { $nin: excludedIds.map(id => ObjectId(id)) }
  }
  if (color.length) {
      query.color = { $in: color }
  }
  if (location.length) {
      query.location = { $in: location }
  }
  if (rating) {
      query.rating = { $gte: rating }
  }
  if (available) {
      query.available = true;
  }
  return query
}



/* Get a list of Bikes excluding reserved Bikes */
module.exports.listOFBikesExcludingReservedBikes = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;
  const { startTime, endTime, model, color, location, available } = req.body

  if (!startTime || !endTime) {
    SetResponse(rcResponse, 400, RequestErrorMsg('InvalidParams', req, null), false);
    httpStatus = 400;
  }

  try {
    const  excludedIds = await getClashedReseravtionsForDateRange(startTime, endTime)
    const basicBikeAggregation = [
      { $match: getQuery({excludedIds, model, color, location, available}) },
    ]
    const paginatedDetailedAggregation = [
        ...basicBikeAggregation,
    ]
    const countAggregation = [
        ...basicBikeAggregation,
        { $count: "count" },
    ]

    console.log("basicBikeAggregation",basicBikeAggregation)
    await Promise.all([
        bikesModal.aggregate(paginatedDetailedAggregation),
        bikesModal.aggregate(countAggregation)
    ]).then(([items, count]) => {
      rcResponse.data = { items, count: count.length? count[0].count: 0 }
    })
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};


/* Get static-data */
module.exports.getStaticData = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;
  try {
    rcResponse.data = bikeData
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};
