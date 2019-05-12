const express = require('express')
const router = express.Router()
const AppartementController = require('../controllers/appartement.controller')

//Lijsten van Appartementen (endpoints)
router.get('/', AppartementController.getAllAppartements)

module.exports = router