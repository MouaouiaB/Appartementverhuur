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
                res.status(200).json({result: rows.recordset})
            }
        })
    },

    // Inloggen methode
    loginUser: (req, res, next) =>{
        logger.info('loginUser aangeroepen')

        //user informatie uit req.body halen
        const user = req.body

        //Verifieer dat de juiste velden aanwezig zijn.
        try {
            //todo: nog te maken
        } catch (ex) {
            const errorObject = {
                message: 'Validation fails: ' + ex.toString(),
                code: 500
            }
            return next(errorObject)
        }
        // SELECT query samenstellen
        const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.emailAddress}'`

        // Query uitvoeren en resultaat retourneren.
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
                // Als we hier zijn:
                if (rows.recordset.length === 0 || req.body.password !== rows.recordset[0].Password) {
                    const errorObject = {
                        message: 'Geen toegang: email bestaat niet of password is niet correct!',
                        code: 401
                    }
                    next(errorObject)
                } else {
                    logger.info('Password match, user logged id')
                    logger.trace(rows.recordset)

                    // Maak de payload, die we in het token stoppen.
                    // De payload kunnen we er bij het verifiëren van het token later weer uithalen.
                    const payload = {
                        UserId: rows.recordset[0].UserId
                    }
                    jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
                        if (err) {
                            const errorObject = {
                                message: 'Kon geen JWT genereren.',
                                code: 500
                            }
                            next(errorObject)
                        }
                        if (token) {
                            res.status(200).json({
                                result: {
                                    token: token
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    // Token validatie
    validateToken: (req, res, next) => {
        logger.info('validateToken aangeroepen')
        // logger.debug(req.headers)
        const authHeader = req.headers.authorization
        if (!authHeader) {
            errorObject = {
                message: 'Authorization header missing!',
                code: 401
            }
            logger.warn('Validate token failed: ', errorObject.message)
            return next(errorObject)
        }
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, 'secretkey', (err, payload) => {
            if (err) {
                errorObject = {
                    message: 'not authorized',
                    code: 401
                }
                logger.warn('Validate token failed: ', errorObject.message)
                next(errorObject)
            }
            logger.trace('payload', payload)
            if (payload.data && payload.data.UserId) {
                logger.debug('token is valid', payload)
                // User heeft toegang. Voeg UserId uit payload toe aan
                // request, voor ieder volgend endpoint.
                req.userId = payload.data.UserId
                next()
            } else {
                errorObject = {
                    message: 'UserId is missing!',
                    code: 401
                }
                logger.warn('Validate token failed: ', errorObject.message)
                next(errorObject)
            }
        })
    },

}