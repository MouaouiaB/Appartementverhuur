module.exports = {
    // een sturctuur geven aan de logger
    logger: require('tracer').colorConsole({
        format: [
            '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
            {
                error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
            }
        ],
        // datum: jaar-maand-dag: uur:minute:second
        dateformat: 'yyyy-m-dd HH:MM:ss',
        preprocess: function(data) {
            data.title = data.title.toUpperCase()
        },
        level: 'info'
    }),

    dbconfig: {
        user: 'progr4',
        password: 'password123',
        server: 'aei-sql.avans.nl',
        database: 'Prog4-Eindopdracht1',
        port: 1443,
        driver: 'msnodesql',
        connectionTimeout: 1500,
        options: {
            // 'true' if you're on Windows Azure
            encrypt: false
        }
    }
}
