const logger = require('../config/app.config').logger
const database = require('../datalayer/mssql.dao')
const asset = require('assert')

module.exports = {


    
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
