const express = require('express')
const router = express.Router()
const AppartementController = require('../controllers/appartement.controller')
const AuthController = require('../controllers/authentication.controller')

//Lijsten van Appartementen (endpoints)
router.get('/', AuthController.validateToken, AppartementController.getAllAppartements)
router.post('/', AppartementController.addAppartement)

module.exports = router