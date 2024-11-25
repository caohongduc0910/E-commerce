import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { ProductService } from './product.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<ResponseData> {
    try {
      const user = await this.productService.findById(id);
      return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      console.log(error);
      return new ResponseData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
