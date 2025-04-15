const { ethers } = require('ethers');
const logger = require('../utils/logger');
require('dotenv').config();

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
