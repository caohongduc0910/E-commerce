import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/users/decorators/user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getNotification(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const order = await this.notificationService.findById(id, userID);
    return new ResponseData(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllNotifications(@GetUser() user: any): Promise<ResponseData> {
    const orders = await this.notificationService.findAll(user.id);
    return new ResponseData(orders, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateNotification(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const orders = await this.notificationService.update(id, user.id);
    return new ResponseData(orders, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteNotification(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const book = await this.notificationService.delete(id, userID);
    return new ResponseData(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
