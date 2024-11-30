import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enums/role.enum';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { GetUser } from 'src/users/decorators/user.decorator';
import { QueryOrderDTO } from './dto/query-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const role = user.role;
    const order = await this.orderService.findById(id, userID, role);
    return new ResponseData(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders(@Query() query: QueryOrderDTO): Promise<ResponseData> {
    const orders = await this.orderService.findAll(query);
    return new ResponseData(orders, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const id = user.id;
    const order = await this.orderService.create(id, createOrderDTO);
    return new ResponseData(order, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancelOrder(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const book = await this.orderService.delete(id, userID);
    return new ResponseData(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
