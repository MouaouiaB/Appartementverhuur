const logger = require('../config/app.config').logger
const database = require('../datalayer/mssql.dao')
const assert = require('assert')

// checken met Regex
const postalCodeValidator = new RegExp('^([1-9][0-9]{3})([ ]{0,1})(?!SD|sd|SS|ss|SA|sa)([a-zA-Z]{2})$')

module.exports = {

    addAppartement: function(req, res, next) {
        logger.info('Post /api/appartements aangeroepen')

        // Check dat we de UserId in het request hebben - vanuit de validateToken functie.
        logger.trace('Appartement id:', req.apartmentId)

        // hier komt in het request een binnen.
        const apartment = req.body
        logger.info(apartment)
        try {
            // Valideer hier de properties van de movie die we gaan maken.
            assert.equal(typeof apartment.description, 'string', 'apartement description is required.')
            assert.equal(typeof apartment.city, 'string', 'apartement city is required.')
            assert.equal(typeof apartment.streetAddress, 'string', 'apartement streetAddress is required.')
            assert(postalCodeValidator.test(apartment.postalCode), 'apartement postalCode is required.')
        } catch (e) {
            const errorObject = {
                message: e.toString(),
                code: 400
            }
            return next(errorObject)
        }

        logger.info(req.userId)

        const query =
            "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City, UserId) " +
            "VALUES ('" + apartment.description + "','" + apartment.streetAddress + "','" +
            apartment.postalCode + "','" + apartment.city + "','" +
            req.userId +
            "'); SELECT * FROM Apartment INNER JOIN DBUser ON Apartment.UserId = DBUser.UserId WHERE ApartmentId = SCOPE_IDENTITY();"

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Something went wrong in the database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({ result: rows.recordset})
            }
        })
    },

    getAllAppartements: (req, res, next) => {
        logger.info('Get /api/appartements aangeroepen')

        const query = 'SELECT * FROM Apartment ' +
            'FULL OUTER JOIN DBUser ON (Apartment.UserId = DBUser.UserId) ' +
            'FULL OUTER JOIN Reservation ON (Apartment.ApartmentId = Reservation.ApartmentId)'
        database.executeQuery(query, (err, rows) => {
            //verwerk error of result
            if (err){
                const errorObject = {
                    message: 'Something went wrong in the database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows){
                res.status(200).json({result: rows.recordset})
            }
        })
    },

    getAppartementById: function(req, res, next) {
        logger.info('Get /api/appartements/:apartmentId aangeroepen')
        const id = req.params.apartmentId;

        const query = 'SELECT * FROM Apartment ' +
                'FULL OUTER JOIN DBUser ON (Apartment.UserId = DBUser.UserId) ' +
                'FULL OUTER JOIN Reservation ON (Apartment.ApartmentId = Reservation.ApartmentId) '+
                `WHERE Apartment.ApartmentId = ${id}`;
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

    updateAppartementById: function(req,res,next) {
        logger.info('Put /api/appartements/:apartmentId aangeroepen')
        const id = req.params.apartmentId;
        const apartment = req.body
        logger.info(apartment)
        try {
            // Valideer hier de properties van de movie die we gaan maken.
            assert.equal(typeof apartment.description, 'string', 'apartement description is required.')
            assert.equal(typeof apartment.city, 'string', 'apartement city is required.')
            assert.equal(typeof apartment.streetAddress, 'string', 'apartement streetAddress is required.')
            assert(postalCodeValidator.test(apartment.postalCode), 'apartement postalCode is required.')
        } catch (e) {
            const errorObject = {
                message: e.toString(),
                code: 400
            }
            return next(errorObject)
        }

        const query =
            `UPDATE Apartment ` +
            `SET Description = '${apartment.description}', StreetAddress = '${apartment.streetAddress}', PostalCode = '${apartment.postalCode}', City = '${apartment.city}' ` +
            `WHERE ApartmentId = ${id} AND UserId = ${req.userId}` +
            `; SELECT * FROM Apartment WHERE ApartmentId = ${id} `;
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

    deleteAppartementById: function(req, res, next) {
        logger.info('Delete /api/appartements/:apartmentId aangeroepen')
        const id = req.params.apartmentId
        const userId = req.userId

        const query = `DELETE FROM Apartment WHERE ApartmentId=${id} AND UserId=${userId}`
        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                logger.trace('Could not delete apartment: ', err)
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
                    const msg = 'Apartment not found or you have no access to this apartment!'
                    logger.trace(msg)
                    const errorObject = {
                        message: msg,
                        code: 401
                    }
                    next(errorObject)
                } else {
                    res.status(200).json({ result: 'The apartment is deleted!' })
                }
            }
        })
    },
}
