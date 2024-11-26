import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { ResponseData } from 'src/globals/globalClass';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { SignInDTO } from './dto/signin.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signupDTO: SignUpDTO): Promise<ResponseData> {
    const newUser = await this.authService.signup(signupDTO);
    return new ResponseData(newUser, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('/signin')
  async signin(@Body() signinDTO: SignInDTO): Promise<ResponseData> {
    const token = await this.authService.signin(signinDTO);
    return new ResponseData(token, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('/verify')
  async verify(@Body() body: any): Promise<any> {
    const { email, codeId } = body;
    const response = await this.authService.verify(email, codeId);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('/re-verify')
  async reVerify(@Body() body: any): Promise<any> {
    const { email } = body;
    const response = await this.authService.reVerify(email);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
  ): Promise<any> {
    const response = await this.authService.changePassword(changePasswordDTO);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('/forget-password')
  async forgerPassword(@Body() body: any): Promise<any> {
    const { email } = body;
    const response = await this.authService.forgetPassword(email);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: any): Promise<any> {
    const { otp, password } = body;
    const response = await this.authService.resetPassword(otp, password);
    return new ResponseData(response, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
