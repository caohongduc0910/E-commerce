import mongoose from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import PaginationHelper from 'src/helpers/pagination.helper';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserQuery } from '../common/interfaces/query.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findById(id: string, userID: string, role: string): Promise<any> {
    if (id !== userID && role === 'user') {
      throw new UnauthorizedException("You can't access this endpoint");
    }
    const user = await this.userModel.findById(id).select('-password');
    return user;
  }

  async findAll(
    keyword: string,
    index: string,
    sortKey: string,
    sortValue: string,
  ): Promise<any> {
    let users = [];

    const query: UserQuery = {
      $or: [],
      isActive: true,
      isDeleted: false,
    };

    if (keyword) {
      const regexKeyword: RegExp = new RegExp(keyword, 'i');

      query.$or.push({ firstName: regexKeyword }, { lastName: regexKeyword });
    }

    let sort: Record<string, any> = {
      createdAt: 'asc',
    };

    if (sortKey && sortValue) {
      sort = { [sortKey]: sortValue };
    }

    const totalUsers = await this.userModel.countDocuments(query);
    const pagination = PaginationHelper(index, totalUsers);
    console.log(pagination);

    users = await this.userModel
      .find(query)
      .sort(sort)
      .limit(pagination.limitItems)
      .skip(pagination.skip);

    console.log(query);
    console.log(users);

    return {
      users: users,
      pagination: pagination,
    };
  }

  async create(user: CreateUserDTO): Promise<any> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
    userID: string,
  ): Promise<User> {
    if (id !== userID) {
      throw new UnauthorizedException("You can't access this endpoint");
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDTO, {
      new: true,
    });

    if (!user) {
      throw new BadRequestException('UserID is not correct');
    }
    return user;
  }

  async delete(id: string, userID: string): Promise<User> {
    if (id !== userID) {
      throw new UnauthorizedException("You can't access this endpoint");
    }
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      {
        new: true,
      },
    );
    if (!user) {
      throw new BadRequestException('UserID is not correct');
    }
    return user;
  }
}
