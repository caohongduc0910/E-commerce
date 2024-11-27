import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import PaginationHelper from 'src/helpers/pagination.helper';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');
    return user;
  }

  async findAll(
    keyword: string,
    index: string,
    sortKey: string,
    sortValue: string,
  ): Promise<User[]> {
    let users = [];

    interface UserQuery {
      $or: Array<{
        firstName?: RegExp;
        lastName?: RegExp;
      }>;
      isActive: boolean;
      isDeleted: boolean;
    }

    const query: UserQuery = {
      $or: [],
      isActive: true,
      isDeleted: false,
    };

    if (keyword) {
      const regexKeyword: RegExp = new RegExp(keyword, 'i');

      query.$or.push({ firstName: regexKeyword }, { lastName: regexKeyword });
    }

    let sort = {};
    if (sortKey && sortValue) {
      sort[sortKey] = sortValue;
    } else {
      sort['firstName'] = 'asc';
    }

    const totalUsers = await this.userModel.countDocuments({
      isActive: true,
    });
    const pagination = PaginationHelper(index, totalUsers);
    console.log(pagination);

    users = await this.userModel
      .find(query)
      .sort(sort)
      .limit(pagination.limitItems)
      .skip(pagination.startItem);

    console.log(query);
    console.log(users);

    return users;
  }

  async create(user: CreateUserDTO): Promise<any> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDTO, {
      new: true,
    });
    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      {
        new: true,
      },
    );
    return user;
  }
}
