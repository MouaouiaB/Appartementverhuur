const express = require('express')
const appartementRoutes = require ('./src/routes/appartement.routes')
const authenticationRoutes = require('./src/routes/authentication.routes')
const reservationRoutes = require('./src/routes/reservation.routes')
const logger = require('./src/config/app.config').logger

const app = express()
const port = 3000

app.use(express.json())

// Generic endpoint handler - voor alle routes
app.all('*', (req, res, next) => {
    // logger.info('Generieke afhandeling aangeroepen!')
    // ES16 deconstructuring
    const { method, url } = req
    logger.info(`${method} ${url}`)
    next()
})

// Hier installeren we de routes
app.use('/api/appartements', appartementRoutes)
app.use('/api', authenticationRoutes)
app.use('/api/appartements', reservationRoutes)

// Handle endpoint not found.
app.all('*', (req, res, next) => {
    const { method, url } = req
    const errorMessage = `${method} ${url} does not exist.`
    logger.warn(errorMessage)
    const errorObject = {
        message: errorMessage,
        code: 404,
        date: new Date()
    }
    next(errorObject)
})

// Error handler
app.use((error, req, res, next) => {
    logger.error('Error handler: ', error.message.toString())
    res.status(error.code).json(error)
})

app.listen(port, () => logger.info(`Example app listening on port ${port}!`))

module.exports = app