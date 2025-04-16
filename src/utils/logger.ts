import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${level}] ${timestamp} ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
