const express = require('express')
const router = express.Router()
const AppartementController = require('../controllers/appartement.controller')
const AuthController = require('../controllers/authentication.controller')

//Lijsten van Appartementen (endpoints)
router.get('/', AppartementController.getAllAppartements)
router.post('/', AuthController.validateToken, AppartementController.addAppartement)

router.get('/:apartmentId', AppartementController.getAppartementById)
router.put('/:apartmentId', AuthController.validateToken, AppartementController.updateAppartementById)
router.delete('/:apartmentId', AuthController.validateToken, AppartementController.deleteAppartementById)

module.exports = router