const express = require('express')
const router = express.Router()
const ReservationController = require('../controllers/reservation.controller')
const AuthController = require('../controllers/authentication.controller')

//Lijsten van Appartementen (endpoints)
router.post('/:id/reservations', AuthController.validateToken, ReservationController.addReservation)
router.get('/:id/reservations', ReservationController.getReservations)
router.get('/:id/reservations/:reservationId', ReservationController.getReservationsById)
router.put('/:id/reservations/:reservationId',AuthController.validateToken, ReservationController.updateReservationById)
router.delete('/:id/reservations/:reservationId',AuthController.validateToken, ReservationController.deleteReservationById)



module.exports = router