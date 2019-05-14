const express = require('express')
const router = express.Router()
const AppartementController = require('../controllers/appartement.controller')
const AuthController = require('../controllers/authentication.controller')

//Lijsten van Appartementen (endpoints)
router.get('/appartements', AppartementController.getAllAppartements)
router.post('/appartements', AuthController.validateToken, AppartementController.addAppartement)
router.get('/appartements/:apartmentId', AppartementController.getAppartementById)

module.exports = router