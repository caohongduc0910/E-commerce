import { Controller, Post, Body, Get } from '@nestjs/common';
import { TransactionService } from './transactions.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('validate')
  async validateSignature(
    @Body() body: { message: string; signature: string },
  ) {
    return this.transactionService.validateSignature(
      body.message,
      body.signature,
    );
  }

  @Get('contract/data')
  async getContractData() {
    return this.transactionService.getContractData();
  }
}
