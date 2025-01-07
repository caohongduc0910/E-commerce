import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class TransactionService {
  private web3 = new Web3(
    'https://mainnet.infura.io/v3/7d607f440572472babdb03dafaeab5ae',
  );
  private contract = new this.web3.eth.Contract(
    [
      /* Your Smart Contract ABI */
    ],
    '0x5C69BEE701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  );

  async validateSignature(message: string, signature: string) {
    try {
      const signer = this.web3.eth.accounts.recover(message, signature);
      return { signer };
    } catch (err) {
      throw new Error('Invalid signature');
    }
  }

  async getContractData() {
    try {
      return await this.contract.methods.yourMethod().call();
    } catch (err) {
      throw new Error('Failed to fetch contract data');
    }
  }
}
