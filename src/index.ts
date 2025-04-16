import cron from 'node-cron';
import logger from './utils/logger';
import { sendRandomToken } from './jobs/tokenSender';
import { config } from './config';

if (config.isCronActive) {
  cron.schedule('*/2 * * * *', () => {
    logger.info('🕒 Starting token sender job (every 2 mins)');
    sendRandomToken();
  });
} else {
  logger.info('🚫 Cron job is disabled via IS_CRON_ACTIVE env variable.');
}
