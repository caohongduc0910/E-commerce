import mongoose from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import {
  calculateOffset,
  calculateTotalPages,
} from 'src/helpers/pagination.helper';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserQuery } from '../common/interfaces/query.interface';
import { QueryUserDTO } from './dto/query-user.dto';

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

  async findAll(queryUser: QueryUserDTO): Promise<any> {
    const { keyword, limit, page, sortKey, sortValue } = queryUser;

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

    const skip = calculateOffset(page, limit);
    const [totalUsers, users] = await Promise.all([
      this.userModel.countDocuments(query),
      this.userModel.find(query).sort(sort).limit(limit).skip(skip),
    ]);

    const pages = calculateTotalPages(limit, totalUsers);

    return {
      users: users,
      totalUsers: totalUsers,
      pages: pages,
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
