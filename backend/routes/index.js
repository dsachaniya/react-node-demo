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
const adminCtrl = require('./../controllers/adminCtrl');


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

module.exports = router;