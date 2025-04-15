const cron = require('node-cron');
const sendRandomToken = require('./jobs/tokenSender');
const logger = require('./utils/logger');
require('dotenv').config();

const isCronActive = process.env.IS_CRON_ACTIVE === 'true';

if (isCronActive) {
	logger.info('Cron is active. Starting scheduler...');

	cron.schedule('0 * * * *', () => {
		logger.info('Starting every hour token transfer job...');
		sendRandomToken();
	});
} else {
	logger.info('Cron is disabled');
}
