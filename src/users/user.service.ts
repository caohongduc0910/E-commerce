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
import { hashPassword } from 'src/helpers/password.helper';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { OrderService } from 'src/orders/order.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private orderService: OrderService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findById(id: string, userID: string, role: string): Promise<any> {
    if (id !== userID && role === 'user') {
      throw new UnauthorizedException("You can't access this endpoint");
    }
    const [user, orders] = await Promise.all([
      this.userModel
        .findById(id)
        .select('-password -codeId -codeIdExpiresAt -isDeleted -deletedAt')
        .lean(),
      this.orderService.findByUserId(id),
    ]);

    return {
      user,
      orders,
    };
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
      createdAt: 'desc',
    };

    if (sortKey && sortValue) {
      sort = { [sortKey]: sortValue, ...sort };
    }

    const skip = calculateOffset(page, limit);
    const [totalUsers, users] = await Promise.all([
      this.userModel.countDocuments(query),
      this.userModel
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select('-password -codeId -codeIdExpiresAt'),
    ]);

    const usersWithOrderStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await this.orderService.getOrderStatsByUserId(
          user.id,
        );
        return {
          ...user.toObject(),
          totalOrders: orderStats.totalOrders || 0,
          totalPaid: orderStats.totalAmount || 0,
        };
      }),
    );

    const pages = calculateTotalPages(limit, totalUsers);

    return {
      users: usersWithOrderStats,
      totalUsers: totalUsers,
      pages: pages,
    };
  }

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    const { firstName, lastName, email, password } = createUserDTO;

    const existUser = await this.userModel.findOne({
      email: email,
    });

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const signupUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await hashPassword(password),
      isActive: true,
    };

    const newUser = await this.userModel.create(signupUser);

    const returnUser = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isActive: newUser.isActive,
    };
    return returnUser;
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
    userID: string,
    file?: Express.Multer.File,
  ): Promise<User> {
    if (id !== userID) {
      throw new BadRequestException("You can't access this endpoint");
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('UserID is not correct');
    }

    let avatarUrl: string | undefined;

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 10MB.');
      }

      const uniqueName = `${uuidv4()}_${Date.now()}`;
      const uploadResult = await this.cloudinaryService.uploadImage(file, {
        public_id: uniqueName,
      });

      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDTO,
          ...(avatarUrl && { avatar: avatarUrl }),
        },
        { new: true },
      )
      .lean();

    delete updatedUser.password;
    delete updatedUser.codeId;
    delete updatedUser.codeIdExpiresAt;
    delete updatedUser.deletedAt;

    return updatedUser;
  }

  async delete(id: string, userID: string): Promise<User> {
    if (id !== userID) {
      throw new BadRequestException("You can't access this endpoint");
    }
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, isActive: false, deletedAt: new Date() },
        {
          new: true,
        },
      )
      .lean();
    if (!user) {
      throw new BadRequestException('UserID is not correct');
    }

    delete user.password;
    delete user.codeId;
    delete user.codeIdExpiresAt;
    delete user.deletedAt;
    return user;
  }
}
