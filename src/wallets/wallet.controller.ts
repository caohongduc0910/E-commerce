import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ResponseData } from 'src/globals/globalClass';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { GetUser } from 'src/users/decorators/user.decorator';
import { CreateWalletDTO } from './dto/create-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/:address')
  async getInfo(@Param('address') address: string) {
    const balance = await this.walletService.getInfo(address);
    return new ResponseData(balance, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveWallet(
    @Body() createWalletDTO: CreateWalletDTO,
    @GetUser() user: any,
  ) {
    const userID = user.id;
    const { address } = createWalletDTO;
    console.log(address, userID);
    const newWallet = await this.walletService.saveWallet(address, userID);
    return new ResponseData(newWallet, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
