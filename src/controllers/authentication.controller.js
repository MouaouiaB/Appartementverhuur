const logger = require('../config/app.config').logger
const jwt = require('jsonwebtoken')
const assert = require('assert')
const database = require('../datalayer/mssql.dao')

module.exports = {

    // Registreren methode
    registerUser: (req, res, next) => {
        logger.info('registerUser aangeroepen')

        //user informatie uit req.body halen
        const user = req.body

        //Verifieer dat de juiste velden aanwezig zijn.
        try {
            assert.equal(typeof user.firstName, 'string', 'firstName is required.')
            //todo: nog afmaken
        } catch (ex) {
            const errorObject = {
                message: 'Validation fails: ' + ex.toString(),
                code: 500
            }
            return next(errorObject)
        }

        //INSERT query vaststellen
        const query =
            `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password)` +
            `VALUES ('${user.firstName}', '${user.lastName}', '${user.streetAddress}', ` +
            `'${user.postCode}', '${user.city}', '${user.dateOfBirth}',` +
            `${user.phoneNumber}, '${user.emailAddress}', '${user.password}')` +
            `; SELECT SCOPE_IDENTITY() AS UserId`

        // Query uitvoeren en resultaat retourneren.
        database.executeQuery(query, (err, rows) => {
            //verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er is iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json(
                    {
                        result: rows
                    }
                )
            }
        })
    },

    // Inloggen methode
    loginUser: (req, res, next)

}