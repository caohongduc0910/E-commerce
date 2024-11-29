import mongoose from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { ProductQuery } from 'src/common/interfaces/query.interface';
import {
  calculateOffset,
  calculateTotalPages,
} from 'src/helpers/pagination.helper';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findById(id: string): Promise<any> {
    const product = await this.productModel.findById(id);
    return product;
  }

  async findAll(queryProduct: QueryProductDTO): Promise<any> {
    const {
      keyword,
      limit,
      page,
      sortKey,
      sortValue,
      category,
      vendor,
      collection,
    } = queryProduct;

    const query: ProductQuery = {
      isDeleted: false,
    };

    if (keyword) {
      const regexKeyword: RegExp = new RegExp(keyword, 'i');
      query.title = regexKeyword;
    }

    if (category) {
      query.category = category;
    }

    if (vendor) {
      query.vendor = vendor;
    }

    if (collection) {
      query.collection = collection;
    }

    let sort: Record<string, any> = {
      createdAt: 'desc',
    };

    if (sortKey && sortValue) {
      sort = { [sortKey]: sortValue, ...sort };
    }

    const skip = calculateOffset(page, limit);
    const [totalProducts, products] = await Promise.all([
      this.productModel.countDocuments(query),
      this.productModel.find(query).sort(sort).limit(limit).skip(skip),
    ]);

    const pages = calculateTotalPages(limit, totalProducts);

    return {
      products: products,
      totalProducts: totalProducts,
      pages: pages,
    };
  }

  async create(
    createProductDTO: CreateProductDTO,
    file: Express.Multer.File,
  ): Promise<any> {
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 10MB.');
    }
    const uniqueName = `${uuidv4()}_${Date.now()}`;

    const uploadResult = await this.cloudinaryService.uploadImage(file, {
      public_id: uniqueName,
    });

    const newCreateProductDTO = {
      ...createProductDTO,
      image: uploadResult.secure_url,
    };
    const newProduct = await this.productModel.create(newCreateProductDTO);
    return newProduct;
  }

  async update(
    id: string,
    updateProductDTO: UpdateProductDTO,
    file: Express.Multer.File,
  ): Promise<Product> {
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 10MB.');
    }
    const uniqueName = `${uuidv4()}_${Date.now()}`;

    const uploadResult = await this.cloudinaryService.uploadImage(file, {
      public_id: uniqueName,
    });

    const newUpdateProductDTO = {
      ...updateProductDTO,
      image: uploadResult.secure_url,
    };
    const updatedBook = await this.productModel.findByIdAndUpdate(
      id,
      newUpdateProductDTO,
      {
        new: true,
      },
    );
    return updatedBook;
  }

  async delete(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false, deletedAt: new Date() },
      {
        new: true,
      },
    );
    return product;
  }
}
