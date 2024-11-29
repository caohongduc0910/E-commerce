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
import { UserService } from './user.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/role/role.guard';
import { GetUser } from './decorators/user.decorator';
import { QueryUserDTO } from './dto/query-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const role = user.role;
    console.log(userID, role);
    const result = await this.userService.findById(id, userID, role);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('')
  async getAllUsers(@Query() query: QueryUserDTO): Promise<ResponseData> {
    console.log(query);
    const users = await this.userService.findAll(query);
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
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user['id'];
    const result = await this.userService.update(id, updateUserDTO, userID);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user['id'];
    const result = await this.userService.delete(id, userID);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
