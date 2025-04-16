import { ethers } from 'ethers';
import { config } from '../config';
import WalletModel from '../models/wallet';
import logger from '../utils/logger';

const provider = new ethers.JsonRpcProvider(config.providerUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const tokenAbi = [
	'function transfer(address to, uint amount) public returns (bool)',
	'function decimals() public view returns (uint8)',
];

const tokenContract = new ethers.Contract(
	config.tokenAddress,
	tokenAbi,
	wallet
);

export async function sendRandomToken(): Promise<void> {
	try {
		const randomWallet = ethers.Wallet.createRandom();
		const to = randomWallet.address;
		const privateKey = randomWallet.privateKey;

		logger.info(`🔑 Created random wallet: ${to}`);
		// Save wallet address and private key to DB
		await WalletModel.create({ address: to, privateKey });

		const decimals: number = await tokenContract.decimals();
		const min = ethers.parseUnits(config.tokenRangeMin, decimals);
		const max = ethers.parseUnits(config.tokenRangeMax, decimals);

		const range = max - min;
		const randomOffset = BigInt(Math.floor(Math.random() * Number(range)));
		const amount = min + randomOffset;

		logger.info(
			`🚀 Sending ${ethers.formatUnits(amount, decimals)} tokens to ${to}`
		);
		const tx = await tokenContract.transfer(to, amount);
		logger.info(`📦 Transaction hash: ${tx.hash}`);
		await tx.wait();
		logger.info(`✅ Transaction confirmed`);
	} catch (error: any) {
		logger.error(`🔥 Error in sendRandomToken: ${error.message}`);
	}
}
