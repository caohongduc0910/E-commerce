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
import { ProductService } from './product.service';
import { ResponseData } from 'src/globals/globalClass';
import { JwtAuthGuard } from 'src/auths/guards/auth.guard';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { QueryProductDTO } from './dto/query-product.dto';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ResponseData> {
    const product = await this.productService.findById(id);
    return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllProducts(@Query() query: QueryProductDTO): Promise<ResponseData> {
    console.log(query);
    const products = await this.productService.findAll(query);
    return new ResponseData(products, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData> {
    // console.log(file);
    const product = await this.productService.create(createProductDTO, file);
    return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData> {
    console.log(file);
    const product = await this.productService.update(
      id,
      updateProductDTO,
      file,
    );
    return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<ResponseData> {
    const book = await this.productService.delete(id);
    return new ResponseData(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
