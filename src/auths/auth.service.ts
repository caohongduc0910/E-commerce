import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { SignInDTO } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import mongoose from 'mongoose';
import { ChangePasswordDTO } from './dto/change-password.dto';
import generateOTP from 'src/helpers/otp.helper';
import { OTPService } from 'src/otps/otp.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { hashPassword, comparePassword } from 'src/helpers/password.helper';
import { QUEUE_NAMES } from 'src/common/constants/queue.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<UserDocument>,
    private jwtService: JwtService,
    private otpSerivce: OTPService,
    @InjectQueue(QUEUE_NAMES.EMAIL)
    private emailQueue: Queue,
  ) {}

  async signup(signupDTO: SignUpDTO): Promise<any> {
    const { email, password } = signupDTO;

    const existUser = await this.userModel.findOne({
      email: email,
    });

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const uuid = uuidv4();
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 120);

    const signupUser = {
      firstName: signupDTO.firstName,
      lastName: signupDTO.lastName,
      email: signupDTO.email,
      password: await hashPassword(password),
      codeId: uuid,
      codeIdExpiresAt: expirationTime,
    };

    const newUser = await this.userModel.create(signupUser);

    const job = await this.emailQueue.add(QUEUE_NAMES.REGISTER, {
      email: email,
      codeID: uuid,
    });

    const returnUser = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isActive: newUser.isActive,
    };
    return returnUser;
  }

  async signin(signinDTO: SignInDTO): Promise<any> {
    const { email, password } = signinDTO;

    const existUser = await this.userModel.findOne({
      email: email,
    });

    if (!existUser) {
      throw new BadRequestException("User doesn't exist");
    }

    const validPassword = await comparePassword(password, existUser.password);
    if (!validPassword) {
      throw new BadRequestException('Wrong password');
    }

    if (!existUser.isActive) {
      throw new BadRequestException('Account is deactivated');
    }

    const payload = { sub: existUser._id, username: existUser.email };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  async verify(email: string, verifyCode: string): Promise<any> {
    const user = await this.userModel.findOne({
      email: email,
      codeId: verifyCode,
    });

    if (!user) {
      throw new BadRequestException('Code ID is invalid');
    } else if (user.isActive) {
      throw new BadRequestException('This account has already been activated.');
    } else if (new Date(user.codeIdExpiresAt) < new Date()) {
      throw new BadRequestException('This code is expired');
    }

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        isActive: true,
      },
    );
    return 'Activated successfully';
  }

  async reVerify(email: string): Promise<any> {
    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) {
      throw new BadRequestException('Email does not exist');
    } else if (user.isActive) {
      throw new BadRequestException('This account has already been activated.');
    }

    const uuid = uuidv4();

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 120);

    await this.userModel.updateOne(
      {
        email: email,
      },
      {
        codeId: uuid,
        codeIdExpiresAt: expirationTime,
      },
    );

    const job = await this.emailQueue.add(QUEUE_NAMES.REGISTER, {
      email: email,
      codeID: uuid,
    });

    return 'Resent verification code successfully! Check your email again';
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO, id: string) {
    const { email, password, newPassword } = changePasswordDTO;

    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) {
      throw new BadRequestException('Wrong email!');
    }

    if (user.id !== id) {
      throw new UnauthorizedException('You cant access this endpoint');
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new BadRequestException('Wrong password');
    }

    const hashed = await hashPassword(newPassword);

    await this.userModel.updateOne(
      {
        email: email,
      },
      {
        password: hashed,
      },
    );

    return 'Changed password successfully!';
  }

  async forgetPassword(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) {
      throw new BadRequestException('User does not exist!');
    }
    const otp = generateOTP();

    const job = await this.emailQueue.add(QUEUE_NAMES.FORGET, {
      email: user.email,
      otp: otp,
    });

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 120);
    this.otpSerivce.create(email, otp, expirationTime);

    return 'Successfully! Check your email to get OTP';
  }

  async resetPassword(otp: string, password: string) {
    const existOTP = await this.otpSerivce.findByOtp(otp);

    if (!existOTP) {
      throw new BadRequestException('Wrong OTP');
    } else if (new Date(existOTP.expiresAt) < new Date()) {
      throw new BadRequestException('This otp is expired');
    }

    const hashed = await hashPassword(password);

    await this.userModel.updateOne(
      {
        email: existOTP.email,
      },
      {
        password: hashed,
      },
    );
    return 'Reset password successfully!';
  }

  async deactivate(id: string, userID: string): Promise<User> {
    if (id !== userID) {
      throw new BadRequestException("You can't access this endpoint");
    }
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false, deletedAt: new Date() },
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
