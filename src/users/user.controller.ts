import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { UserService } from './user.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/role/role.guard';
import { User } from './schemas/user.schema';
import { GetUser } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<ResponseData> {
    const userID = user['id'];
    const role = user['role'];
    console.log(userID, role);
    const result = await this.userService.findById(id, userID, role);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<ResponseData> {
    const user = await this.userService.create(createUserDTO);
    return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
    @GetUser() user: User,
  ): Promise<ResponseData> {
    const userID = user['id'];
    const result = await this.userService.update(id, updateUserDTO, userID);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async deleteUser(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<ResponseData> {
    const userID = user['id'];
    const result = await this.userService.delete(id, userID);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
