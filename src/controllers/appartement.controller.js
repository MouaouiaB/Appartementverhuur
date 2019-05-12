const logger = require('../config/app.config').logger
const database = require('../datalayer/mssql.dao')
const assert = require('assert')

module.exports = {

    addAppartement: function(req, res, next) {
        logger.info('Post /api/appartements aangeroepen')

        // Check dat we de UserId in het request hebben - vanuit de validateToken functie.
        logger.trace('Appartement id:', req.apartmentId)

        // hier komt in het request een movie binnen.
        const apartment = req.body
        logger.info(apartment)
        try {
            // Valideer hier de properties van de movie die we gaan maken.
            assert.equal(typeof apartment.description, 'string', 'apartment description is required.')
        } catch (e) {
            const errorObject = {
                message: e.toString(),
                code: 400
            }
            return next(errorObject)
        }

        const query =
            "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City) VALUES ('" +
            apartment.description +
            "','" +
            apartment.streetAddress +
            "','" +
            apartment.postalCode +
            "','" +
            apartment.city +
            "','" ;
            // req.userId +
            // "'); SELECT * FROM Movie INNER JOIN DBUser ON Movie.UserId = DBUser.UserId WHERE MovieId = SCOPE_IDENTITY();"

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
                res.status(200).json({ result: rows })
            }
        })
    },

    getAllAppartements: (req, res, next) => {
        logger.info('Get /api/appartements aangeroepen')

        const query = 'SELECT * FROM Apartment '
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
                res.status(200).json({result: rows})
            }
        })
    }
}
