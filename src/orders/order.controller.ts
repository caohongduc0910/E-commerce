import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpMessage, HttpStatus } from 'src/globals/globalEnum';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enums/role.enum';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getProduct(@Param('id') id: string): Promise<ResponseData> {
//     try {
//       const user = await this.productService.findById(id);
//       return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
//     } catch (error) {
//       console.log(error);
//       return new ResponseData(null, HttpStatus.ERROR, HttpMessage.ERROR);
//     }
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Get()
//   async getAllProducts(@Query() query: QueryProductDTO): Promise<ResponseData> {
//     console.log(query);
//     const products = await this.productService.findAll(query);
//     return new ResponseData(products, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Post()
//   @UseInterceptors(
//     FileInterceptor('img', {
//       storage: memoryStorage(),
//       limits: { fileSize: 10 * 1024 * 1024 },
//     }),
//   )
//   async createProduct(
//     @Body() createProductDTO: CreateProductDTO,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<ResponseData> {
//     console.log(file);
//     const product = await this.productService.create(createProductDTO, file);
//     return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Patch(':id')
//   @UseInterceptors(
//     FileInterceptor('img', {
//       storage: memoryStorage(),
//       limits: { fileSize: 10 * 1024 * 1024 },
//     }),
//   )
//   async updateProduct(
//     @Param('id') id: string,
//     @Body() updateProductDTO: UpdateProductDTO,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<ResponseData> {
//     console.log(file);
//     const product = await this.productService.update(
//       id,
//       updateProductDTO,
//       file,
//     );
//     return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   @Delete(':id')
//   async deleteProduct(@Param('id') id: string): Promise<ResponseData> {
//     const book = await this.productService.delete(id);
//     return new ResponseData(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
//   }
}
