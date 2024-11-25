import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async findById(id: string): Promise<any> {
    const product = await this.productModel.findById(id);
    return product;
  }

//   async create(user: SignUpDTO): Promise<any> {
//     const newUser = await this.userModel.create(user);
//     return newUser;
//   }
}
