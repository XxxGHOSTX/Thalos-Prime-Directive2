const winston = require('winston');

const createLogger = () => {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const logFormat = process.env.LOG_FORMAT || 'json';

  const formats = [];

  if (logFormat === 'json') {
    formats.push(winston.format.json());
  } else {
    formats.push(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${metaString}`;
      })
    );
  }

  return winston.createLogger({
    level: logLevel,
    format: winston.format.combine(...formats),
    transports: [new winston.transports.Console()],
    exitOnError: false
  });
};

module.exports = { createLogger };
