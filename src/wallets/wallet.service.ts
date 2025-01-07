import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Web3 from 'web3';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  private web3 = new Web3(
    'https://mainnet.infura.io/v3/7d607f440572472babdb03dafaeab5ae',
  );

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async getInfo(address: string) {
    const balance = await this.web3.eth.getBalance(address);
    const gas = await this.web3.eth.getGasPrice();
    const nonce = await this.web3.eth.getTransactionCount(address);
    return {
      address,
      gas: gas.toString(),
      nonce,
      balance: this.web3.utils.fromWei(balance, 'ether'),
    };
  }

  async saveWallet(address: string, userId: string) {
    const balance = await this.web3.eth.getBalance(address);
    const wallet = await this.walletModel.create({
      userId,
      address,
      balance: this.web3.utils.fromWei(balance, 'ether'),
    });

    return wallet;
  }
}
