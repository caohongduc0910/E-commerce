import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { UserService } from './user.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ResponseData> {
    const user = await this.userService.findById(id);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllUsers(@Query() query: any): Promise<ResponseData> {
    const { keyword, index, sortKey, sortValue } = query;
    const users = await this.userService.findAll(
      keyword,
      index,
      sortKey,
      sortValue,
    );
    return new ResponseData(users, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post()
  async createBook(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<ResponseData> {
    const user = await this.userService.create(createUserDTO);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<ResponseData> {
    const user = await this.userService.update(id, updateUserDTO);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Patch(':id')
  async deleteBook(
    @Param('id') id: string,
  ): Promise<ResponseData> {
    const user = await this.userService.delete(id);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
