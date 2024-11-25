import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { SignUpDTO } from 'src/auths/dto/signup.dto';

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

  async findByEmail(email: string): Promise<any> {
    const user = await this.userModel.find({
      email: email
    }).select('-password');
    return user;
  }

  async findByCodeId(codeId: string): Promise<any> {
    const user = await this.userModel.find({
      codeId: codeId
    }).select('-password');
    return user;
  }

  async create(user: SignUpDTO): Promise<any> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }
}
