/*
FileName : checkToken.js
Description : This file consist of middleware functions to use while requesting data
*/

const jwt = require('jsonwebtoken');
const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse, UserRoles } = require('./../helpers/common');

// validates access token for user
exports.validateToken = function (req, res, next) {

  /* Contruct response object */
  let rcResponse = new ApiResponse();

  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

  // decode token
  if (token) {
    // verifies secret
    jwt.verify(token, process.env['SECRET'], function (err, decoded) {
      if (err) {
        console.log("err",err)
        SetResponse(rcResponse, 403, RequestErrorMsg('InvalidToken', req, null), false);
        let httpStatus = 403;
        return res.status(httpStatus).send(rcResponse);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    SetResponse(rcResponse, 401, RequestErrorMsg('InvalidToken', req, null), false);
    let httpStatus = 401;
    return res.status(httpStatus).send(rcResponse);
  }
};

// check if the requesting user is Manager user
module.exports.isManagerUser = async (req, res, next) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();

  const roles = new UserRoles();
  if (req.decoded.role !== roles.manager) {
    SetResponse(rcResponse, 403, RequestErrorMsg('NotAuthorized', req, null), false);
    httpStatus = 403;
    return res.status(httpStatus).send(rcResponse);
  } else {
    next();
  }
};