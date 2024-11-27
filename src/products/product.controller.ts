import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
import { Public } from 'src/auths/decorators/public.decorator';
import { memoryStorage } from 'multer';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ResponseData> {
    try {
      const user = await this.productService.findById(id);
      return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      console.log(error);
      return new ResponseData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts(@Query() query: any): Promise<ResponseData> {
    const { keyword, index, sortKey, sortValue, category, vendor, collection } =
      query;
    const products = await this.productService.findAll(
      keyword,
      index,
      sortKey,
      sortValue,
      category,
      vendor,
      collection,
    );
    return new ResponseData(products, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: memoryStorage(),
    }),
  )
  @Public()
  @UseGuards(JwtAuthGuard)
  @Post()
  // @UseInterceptors(
  //   FileInterceptor('img', {
  //     storage: memoryStorage(),
  //     limits: { fileSize: 5 * 1024 * 1024 },
  //   }),
  // )
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData> {
    const product = await this.productService.create(createProductDTO, file);
    return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO,
  ): Promise<ResponseData> {
    const product = await this.productService.update(id, updateProductDTO);
    return new ResponseData(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async deleteProduct(@Param('id') id: string): Promise<ResponseData> {
    const book = await this.productService.delete(id);
    return new ResponseData(book, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }
}
