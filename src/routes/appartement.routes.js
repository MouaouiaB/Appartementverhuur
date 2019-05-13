const express = require('express')
const router = express.Router()
const AppartementController = require('../controllers/appartement.controller')
const AuthController = require('../controllers/authentication.controller')

//Lijsten van Appartementen (endpoints)
router.get('/appartements', AuthController.validateToken, AppartementController.getAllAppartements)
router.post('/appartements', AuthController.validateToken, AppartementController.addAppartement)

module.exports = router