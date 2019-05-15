const logger = require('../config/app.config').logger
const database = require('../datalayer/mssql.dao')
const assert = require('assert')

const dateValidator = new RegExp('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))')
module.exports = {

    addReservation: (req, res, next) => {
        logger.info('createReservation is aangeroepen');

        const id = req.params.id;
        const reservation = req.body;

        try {
            assert(dateValidator.test(reservation.startDate), 'startDate is required.')
            assert(dateValidator.test(reservation.endDate), 'endDate is required.')
            assert.equal(typeof reservation.status, 'string', 'status is required');
        } catch (e) {
            const errorObject = {
                message: 'Validation fails: ' + e.toString(),
                code: 500
            };
            return next(errorObject)
        }

        logger.info(reservation);

        const query =
            "INSERT INTO Reservation(ApartmentId, StartDate, EndDate, Status, UserId) VALUES ('" +
            id +
            "','" +
            reservation.startDate +
            "','" +
            reservation.endDate +
            "','" +
            'INITIAL' +
            "','" +
            req.userId +
            "');"

        logger.info(req.body);

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: "Er ging iets mis in de database",
                    code: 500
                };
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({result: 'Succeeded'})
            }
        })
    },

    getReservations: (req, res, next) => {
        logger.info('getReservations is aangeroepen');

        const id = req.params.id;

        const query = `SELECT * FROM [Reservation] WHERE ApartmentId = ${id}`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                };
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({result: rows.recordset})
            }
        })
    },

    getReservationsById: (req,res,next) =>{
        logger.info('Get /api/appartements/:id/reservations/:id aangeroepen')
        const reservationId = req.params.reservationId;
        const apartmentId =  req.params.id

        const query = 'SELECT * FROM Apartment '+
            'JOIN Reservation ON (Apartment.ApartmentId = Reservation.ApartmentId) ' +
            `WHERE Reservation.ReservationId = ${reservationId} AND Apartment.ApartmentId = ${apartmentId}`;
        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({ result: rows.recordset })
            }
        })
    },

    updateReservationById: (req, res, next) =>{
        logger.info('Put /api/appartements/:id/reservations/:id aangeroepen')
        const id = req.params.id;
        const reservationId = req.params.reservationId;
        const reservation = req.body
        logger.info(reservation)


        const query =
            `UPDATE Reservation ` +
            `SET StartDate = '${reservation.startDate}', EndDate = '${reservation.endDate}', Status = '${reservation.status}' ` +
            `WHERE ApartmentId = ${id} AND ReservationId = ${reservationId} AND UserId = ${req.userId}` +
            `; SELECT * FROM Reservation WHERE ReservationId = ${reservationId} `;
        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({ result: rows.recordset })
            }
        })
    },

    deleteReservationById: function(req, res, next) {
        logger.info('deleteReservation is aangeroepen');
        const reservationId = req.params.reservationId;
        const userId = req.userId;

        const query = `DELETE FROM Reservation WHERE ReservationId = ${reservationId} AND UserId = ${userId};`;

        database.executeQuery(query, (err, rows) => {

            if (err) {
                logger.trace('Could not delete reservation: ', err)
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                if (rows.rowsAffected[0] === 0) {
                    // query ging goed, maar geen film met de gegeven MovieId EN userId.
                    // -> retourneer een error!
                    const msg = 'Reservation not found or you have no access to this reservation!'
                    logger.trace(msg)
                    const errorObject = {
                        message: msg,
                        code: 401
                    }
                    next(errorObject)
                } else {
                    res.status(200).json({ result: 'The reservation is deleted!' })
                }
            }
        })
    }

}