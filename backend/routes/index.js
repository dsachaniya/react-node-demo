/*
FileName : Index.js
Description : This file consist of list of routes for the APIs
*/

/* DEPENDENCIES */
const express = require('express');
const router = express.Router();
const authCtrl = require('./../controllers/authCtrl');
const bikeCtrl = require('../controllers/bikeCtrl');
const checkToken = require('./../middlewares/checkToken');
const reservationCtrl = require('../controllers/reservationCtrl');
const dbConnection = require('./../config/dbConnection');
/*****************************
 USERS
 *****************************/

/* Authenticate User */
router.post('/user/login', authCtrl.login);

/* Register new User */
router.post('/user/register', authCtrl.register);

/* Get User profile information */
router.get('/user/profile', checkToken.validateToken, authCtrl.getUserProfile);

/* Get list of users */
router.get('/user/list', checkToken.validateToken, checkToken.isManagerUser, authCtrl.listAllUsers);

/* Put user by id */
router.put('/user/:userId', checkToken.validateToken, checkToken.isManagerUser, authCtrl.userUpdate);

/* Delete user by id */
router.delete('/user/:userId', checkToken.validateToken, checkToken.isManagerUser, authCtrl.deleteUser);



/*****************************
 BIKES
 *****************************/

 /* Create new Bike */
router.post('/bikes', checkToken.validateToken,checkToken.isManagerUser, bikeCtrl.createBike);

/* Get available bikes list */
router.get('/bikes/available', checkToken.validateToken, bikeCtrl.getAvailableBikes);

/* List all bikes */
router.get('/bikes/list', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.listAllBikes);

/* Reserve a bike */
router.post('/bikes/reserve', checkToken.validateToken, reservationCtrl.createReservation);

/* list of bikes excluding reserved bikes */
router.post('/bikes/exlcuding-reserved', checkToken.validateToken, bikeCtrl.listOFBikesExcludingReservedBikes);

/* Put bike by id */
router.put('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.updateBikeDetails);

/* Get bike details by id */
router.get('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.getBikeDetails);

/* Delete a bike */
router.delete('/bikes/:bikeId', checkToken.validateToken, checkToken.isManagerUser, bikeCtrl.deleteBike);


/*****************************
 RESERVATIONS
 *****************************/

 /* Create new Reservations */
 router.post('/reservations', checkToken.validateToken,  reservationCtrl.createReservation);

/* List of users by bike they reserved */
router.post('/reservations/users', checkToken.validateToken, checkToken.isManagerUser, reservationCtrl.listOfUsers);

/* List of bikes by user */
router.post('/reservations/bikes', checkToken.validateToken, reservationCtrl.listOfBikes);

 /* Create new Reservations */
 router.put('/reservations/:reservationId', checkToken.validateToken,  reservationCtrl.updateReservation);

 /*****************************
 STATIC-DATA
 *****************************/

 /* fetch static-data */
 router.get('/static-data', bikeCtrl.getStaticData);

module.exports = router;