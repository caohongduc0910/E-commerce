import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import PaginationHelper from 'src/helpers/pagination.helper';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findById(id: string): Promise<any> {
    const product = await this.productModel.findById(id);
    return product;
  }

  async findAll(
    keyword: string,
    index: string,
    sortKey: string,
    sortValue: string,
    category: string,
    vendor: string,
    collection: string,
  ): Promise<Product[]> {
    let products = [];

    interface ProductQuery {
      title?: RegExp;
      category?: string;
      vendor?: string;
      collection?: string;
      isDeleted: boolean;
    }

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

    let sort = {};
    if (sortKey && sortValue) {
      sort[sortKey] = sortValue;
    } else {
      sort['title'] = 'asc';
    }

    const totalProducts = await this.productModel.countDocuments({
      active: true,
    });
    const pagination = PaginationHelper(index, totalProducts);

    console.log(pagination);
    console.log(query);

    products = await this.productModel
      .find(query)
      .sort(sort)
      .limit(pagination.limitItems)
      .skip(pagination.startItem);

    return products;
  }

  async create(createProductDTO: CreateProductDTO, file): Promise<any> {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    const newCreateProductDTO = {
      ...createProductDTO,
      image: uploadResult.secure_url,
    };
    const newProduct = await this.productModel.create(newCreateProductDTO);
    return newProduct;
  }

  async update(id: string, product: UpdateProductDTO): Promise<Product> {
    const updatedBook = await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
    return updatedBook;
  }

  async delete(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      },
    );
    return product;
  }
}
