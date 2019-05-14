const logger = require('../config/app.config').logger
const jwt = require('jsonwebtoken')
const assert = require('assert')
const database = require('../datalayer/mssql.dao')

//const bcrypt = require("bcrypt");
//const saltRounds = 10;

const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$')
const postalCodeValidator = new RegExp('^([1-9][0-9]{3})([ ]{0,1})(?!SD|sd|SS|ss|SA|sa)([a-zA-Z]{2})$')
const dateValidator = new RegExp('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))')
const emailValidator = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')

module.exports = {

    registerUser: (req, res, next) => {
        logger.info('registerUser aangeroepen')

        // user informatie uit req.body halen
        const user = req.body

        // Verifieer dat de juiste velden aanwezig zijn (Regex)
        try {
            assert.equal(typeof user.firstName, 'string', 'firstName is required.')
            assert.equal(typeof user.lastName, 'string', 'lastName is required.')
            assert.equal(typeof user.streetAddress, 'string', 'streetAddress is required.')
            assert(phoneValidator.test(user.phoneNumber), 'phoneNumber is required.')
            assert(postalCodeValidator.test(user.postCode), 'postcode is required.')
            assert.equal(typeof  user.city , 'string', 'city is required.')
            assert(dateValidator.test(user.dateOfBirth), 'dateOfBirth is required.')
            assert(emailValidator.test(user.emailAddress), 'emailAddress is required.')
            assert.equal(typeof  user.password, 'string', 'password is required.')
        } catch (ex) {
            const errorObject = {
                message: 'Validation fails: ' + ex.toString(),
                code: 500
            }
            return next(errorObject)
        }
        // password hashen
        //const hash = bcrypt.hashSync(req.password, saltRounds);

        // INSERT query samenstellen
        const query =
            `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password)` +
            `VALUES ('${user.firstName}', '${user.lastName}', '${user.streetAddress}', ` +
            `'${user.postCode}', '${user.city}', '${user.dateOfBirth}',` +
            `${user.phoneNumber}, '${user.emailAddress}', '${user.password}')` +
            `; SELECT SCOPE_IDENTITY() AS UserId`

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
                res.status(200).json({ result: rows.recordset })
            }
        })
    },

    loginUser: (req, res, next) => {
        logger.info('loginUser aangeroepen')

        // user informatie uit req.body halen
        const user = req.body

        // Verifieer dat de juiste velden aanwezig zijn. ToDo.
        assert.equal(typeof  user.password, 'string', 'password is required.')

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
                    // if (
                    //     rows.length === 1 &&
                    //     bcrypt.compareSync(req.password, rows[0].Password)
                    // )
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

    getAll: (req, res, next) => {
        logger.info('getAll aangeroepen')

        // query samenstellen met user data
        const query = `SELECT * FROM [DBUser]`

        // Query aanroepen op de database
        database.executeQuery(query, (err, rows) => {
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
    }
}