import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { ResponseData } from 'src/globals/globalClass';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { SignInDTO } from './dto/signin.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { GetUser } from 'src/users/decorators/user.decorator';
import { VerifyDTO } from './dto/verify.dto';
import { ReVerifyDTO } from './dto/re-verify.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignUpDTO): Promise<ResponseData> {
    const newUser = await this.authService.signup(signupDTO);
    return new ResponseData(newUser, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('signin')
  @ApiOkResponse({
    description: 'OK',
    type: ResponseData,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: '',
        },
        errors: {
          type: 'array',
          example: [],
        },
      },
    },
  })
  async signin(@Body() signinDTO: SignInDTO): Promise<ResponseData> {
    const token = await this.authService.signin(signinDTO);
    return new ResponseData(token, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('verify')
  async verify(@Body() body: VerifyDTO): Promise<any> {
    const { email, codeId } = body;
    const response = await this.authService.verify(email, codeId);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('re-verify')
  async reVerify(@Body() body: ReVerifyDTO): Promise<any> {
    const { email } = body;
    const response = await this.authService.reVerify(email);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @GetUser() user: any,
  ): Promise<any> {
    const id = user.id;
    const response = await this.authService.changePassword(
      changePasswordDTO,
      id,
    );
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('forget-password')
  async forgerPassword(@Body() body: ForgetPasswordDTO): Promise<any> {
    const { email } = body;
    const response = await this.authService.forgetPassword(email);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDTO): Promise<any> {
    const { otp, password } = body;
    const response = await this.authService.resetPassword(otp, password);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deactivate/:id')
  async deactivateUser(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<ResponseData> {
    const userID = user.id;
    const result = await this.authService.deactivate(id, userID);
    return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
