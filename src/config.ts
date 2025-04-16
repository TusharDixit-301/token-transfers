import dotenv from 'dotenv';
import { config as validate } from 'process';

dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`❌ Environment variable ${key} is required but not set.`);
  }
  return value!;
}

export const config = {
  isCronActive: getEnv('IS_CRON_ACTIVE', false) === 'true',

  providerUrl: getEnv('PROVIDER_URL'),
  privateKey: (() => {
    const key = getEnv('PRIVATE_KEY');
    const normalized = key.startsWith('0x') ? key : `0x${key}`;
    if (normalized.length !== 66) throw new Error('❌ PRIVATE_KEY must be 64 hex characters.');
    return normalized;
  })(),

  tokenAddress: getEnv('TOKEN_ADDRESS'),
  tokenRangeMin: getEnv('TOKEN_RANGE_MIN', false) || '0.001',
  tokenRangeMax: getEnv('TOKEN_RANGE_MAX', false) || '0.009',
  dbUrl: getEnv('DB_URL'),
};
