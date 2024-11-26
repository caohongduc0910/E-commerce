import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { UserService } from './user.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<ResponseData> {
    const user = await this.userService.findById(id);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
