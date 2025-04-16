const { ethers } = require('ethers');
const logger = require('../utils/logger');
require('dotenv').config();

// === Env Validation & Normalization ===
let rawPrivateKey = process.env.PRIVATE_KEY;

if (!rawPrivateKey) {
	throw new Error('❌ PRIVATE_KEY is missing in environment.');
}

// Normalize to start with 0x
if (!rawPrivateKey.startsWith('0x')) {
	rawPrivateKey = '0x' + rawPrivateKey;
}

if (rawPrivateKey.length !== 66) {
	throw new Error(
		'❌ PRIVATE_KEY must be 64 hex characters (32 bytes), optionally prefixed with 0x.'
	);
}

if (!process.env.PROVIDER_URL) {
	throw new Error('❌ PROVIDER_URL is not defined in environment.');
}

if (
	!process.env.TOKEN_ADDRESS ||
	!ethers.isAddress(process.env.TOKEN_ADDRESS)
) {
	throw new Error('❌ Invalid or missing TOKEN_ADDRESS in environment.');
}

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAbi = [
	'function transfer(address to, uint amount) public returns (bool)',
	'function decimals() public view returns (uint8)',
];

const tokenContract = new ethers.Contract(
	process.env.TOKEN_ADDRESS,
	tokenAbi,
	wallet
);

function getRandomBigInt(min, max) {
	const range = max - min;
	const rand = BigInt(Math.floor(Math.random() * Number(range)));
	return min + rand;
}

async function sendRandomToken() {
	try {
		const randomWallet = ethers.Wallet.createRandom();
		const to = randomWallet.address;
		logger.info(`Created random wallet: ${to}`);

		const decimals = await tokenContract.decimals();

		const minStr = process.env.TOKEN_RANGE_MIN || '0.001';
		const maxStr = process.env.TOKEN_RANGE_MAX || '0.009';

		const minWei = ethers.parseUnits(minStr, decimals); // BigInt
		const maxWei = ethers.parseUnits(maxStr, decimals); // BigInt

		const amount = getRandomBigInt(minWei, maxWei);

		logger.info(
			`Sending ${ethers.formatUnits(amount, decimals)} tokens to ${to}`
		);

		const tx = await tokenContract.transfer(to, amount);
		logger.info(`Transaction hash: ${tx.hash}`);
		await tx.wait();
		logger.info(`Transaction confirmed`);
	} catch (error) {
		logger.error(`Error in sendRandomToken: ${error.message}`);
	}
}

module.exports = sendRandomToken;
