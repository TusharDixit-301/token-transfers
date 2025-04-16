import mongoose from 'mongoose';
import { config } from '../config';
import logger from '../utils/logger';

export const connectDB = async () => {
	try {
		mongoose.connection.on('connected', () => {
			logger.info('Connection to Database established');
		});
		mongoose.connection.on('error', (error) => {
			logger.error(`${error.message}`);
		});
		await mongoose.connect(config.dbUrl);
	} catch (error) {
		logger.error(`${error}`);
		process.exit(1);
	}
};
