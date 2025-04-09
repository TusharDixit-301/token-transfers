const { ethers } = require('ethers');
const logger = require('../utils/logger');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAbi = [
  "function transfer(address to, uint amount) public returns (bool)",
  "function decimals() public view returns (uint8)"
];

const tokenContract = new ethers.Contract(process.env.TOKEN_ADDRESS, tokenAbi, wallet);

async function sendRandomToken() {
  try {
    const randomWallet = ethers.Wallet.createRandom();
    const to = randomWallet.address;
    logger.info(`Created random wallet: ${to}`);

    const decimals = await tokenContract.decimals();
    const randomAmount = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    const amount = ethers.parseUnits(randomAmount.toString(), decimals);

    logger.info(`Sending ${randomAmount} tokens to ${to}`);

    const tx = await tokenContract.transfer(to, amount);
    logger.info(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    logger.info(`Transaction confirmed`);
  } catch (error) {
    logger.error(`Error in sendRandomToken: ${error.message}`);
  }
}

module.exports = sendRandomToken;
