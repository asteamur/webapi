const winston = require('winston')
require('winston-mongodb')

const { combine, timestamp, printf } = winston.format

const critialFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
})

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.MongoDB({
        db: process.env.DB_URI,
        capped: true
      })
    ]
})


const critialFile = winston.createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        critialFormat
    ),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
})

module.exports = {logger, critialFile}