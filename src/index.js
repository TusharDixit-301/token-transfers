const cron = require('node-cron');
const sendRandomToken = require('./jobs/tokenSender');
const logger = require('./utils/logger');

logger.info('Cron job initialized...');

// Runs every hour at minute 0
cron.schedule('0 * * * *', () => {
  logger.info('Starting hourly token transfer job...');
  sendRandomToken();
});
