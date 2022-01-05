/*
FileName : Index.js
Description : This file consist of list of routes for the APIs
*/

/* DEPENDENCIES */
const express = require('express');
const router = express.Router();
const dbConnection = require('./../config/dbConnection');
const authCtrl = require('./../controllers/authCtrl');
const bikeCtrl = require('../controllers/bikeCtrl');
const checkToken = require('./../middlewares/checkToken');
const adminCtrl = require('../controllers/managerCtrl');


/*****************************
 USERS
 *****************************/

/* Authenticate User */
router.post('/user/login', authCtrl.login);

/* Register new User */
router.post('/user/register', authCtrl.register);

/* Get User profile information */
router.get('/user/profile', checkToken.validateToken, authCtrl.getUserProfile);

/* Put user by id */
router.put('/user/:userId', checkToken.validateToken, checkToken.isManagerUser, authCtrl.userUpdate);



/*****************************
 BIKES
 *****************************/

 /* Create new Bike */
router.post('/bikes', checkToken.validateToken,checkToken.isManagerUser, bikeCtrl.createBike);

/* Get available bikes list */
router.get('/bikes/available', checkToken.validateToken, bikeCtrl.getAvailableBikes);

/* Put bike by id */
router.put('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.updateBikeDetails);

/* Get bike details by id */
router.get('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.getBikeDetails);



/* Delete a bike */
router.delete('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.deleteBike);

module.exports = router;