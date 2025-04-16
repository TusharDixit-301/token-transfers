import cron from 'node-cron';
import { config } from './config';
import { connectDB } from './config/db';
import { sendRandomToken } from './jobs/tokenSender';
import logger from './utils/logger';

(async () => {
	await connectDB();

	if (!config.isCronActive) {
		logger.info('⏸️ Cron is disabled via environment variable.');
		return;
	}

	cron.schedule('*/2 * * * *', () => {
		logger.info('⏰ Running cron job (every 2 minutes)...');
		sendRandomToken();
	});
})();
