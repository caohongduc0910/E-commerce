import mongoose, { Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDTO } from './dto/create-order.dto';
import { ProductService } from 'src/products/product.service';
import { User } from 'src/users/schemas/user.schema';
import { QueryOrderDTO } from './dto/query-order.dto';
import { OrderQuery } from 'src/common/interfaces/query.interface';
import {
  calculateOffset,
  calculateTotalPages,
} from 'src/helpers/pagination.helper';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: mongoose.Model<Order>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private readonly productService: ProductService,
  ) {}

  async findById(id: string): Promise<any> {
    const order = await this.orderModel.findById(id);
    // console.log(order.userId);
    if (id != order.userId) {
      throw new BadRequestException("You can't access this endpoint");
    }
    const user = await this.userModel
      .findById(order.userId)
      .select('-password -id -codeId -codeIdExpiresAt');
    return {
      order: order,
      user: user,
    };
  }

  async findAll(queryProduct: QueryOrderDTO): Promise<any> {
    const { keyword, limit, page, sortKey, sortValue, status } = queryProduct;

    const query: OrderQuery = {};

    if (keyword) {
      const regexKeyword: RegExp = new RegExp(keyword, 'i');
      query.name = regexKeyword;
    }

    if (status) {
      query.status = status;
    }

    let sort: Record<string, any> = {
      createdAt: 'desc',
    };

    if (sortKey && sortValue) {
      sort = { [sortKey]: sortValue, ...sort };
    }

    const skip = calculateOffset(page, limit);
    const [totalOrders, orders] = await Promise.all([
      this.orderModel.countDocuments(query),
      this.orderModel.find(query).sort(sort).limit(limit).skip(skip),
    ]);

    const pages = calculateTotalPages(limit, totalOrders);

    console.log(query);

    return {
      orders: orders,
      totalOrders: totalOrders,
      pages: pages,
    };
  }

  async create(id: string, createOrderDTO: CreateOrderDTO): Promise<any> {
    if (!id) {
      throw new BadRequestException('Login to buy!');
    }

    const { products, delivery_option } = createOrderDTO;

    const invalidIds = products
      .map((product) => product.productId)
      .filter((productId) => !Types.ObjectId.isValid(productId));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid product IDs: ${invalidIds.join(', ')}`,
      );
    }

    const productChecks = products.map((product) =>
      this.productService.findById(product.productId),
    );

    const results = await Promise.all(productChecks);

    const nonExistentProducts = results
      .map((result, index) => (result ? null : products[index].productId))
      .filter((id) => id !== null);

    if (nonExistentProducts.length > 0) {
      throw new BadRequestException(
        `Products not found: ${nonExistentProducts.join(', ')}`,
      );
    }

    const updatedProducts = products.map((product, index) => {
      const dbProduct = results[index];
      const price = dbProduct.salePrice || dbProduct.price;
      const itemSubtotal = price * product.quantity;

      return {
        ...product,
        price,
        itemSubtotal,
      };
    });

    console.log(updatedProducts);

    const subtotal = updatedProducts.reduce(
      (sum, product) => sum + product.itemSubtotal,
      0,
    );

    let delivery_fee = 100;
    if (delivery_option === 'express') {
      delivery_fee = 200;
    }
    const discount = 0.2 * subtotal;
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal + tax + delivery_fee - discount;

    const user = await this.userModel.findById(id);

    const newCreateOrderDTO = {
      userId: id,
      name: user.firstName + ' ' + user.lastName,
      products: updatedProducts,
      delivery_option: delivery_option,
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      delivery_fee: delivery_fee,
      total: total,
    };
    const newOrder = await this.orderModel.create(newCreateOrderDTO);
    return newOrder;
  }

  //   async update(
  //     id: string,
  //     updateProductDTO: UpdateProductDTO,
  //     file: Express.Multer.File,
  //   ): Promise<Product> {
  //     if (file.size > 10 * 1024 * 1024) {
  //       throw new BadRequestException('File size exceeds 10MB.');
  //     }
  //     const uniqueName = `${uuidv4()}_${Date.now()}`;

  //     const uploadResult = await this.cloudinaryService.uploadImage(file, {
  //       public_id: uniqueName,
  //     });

  //     const newUpdateProductDTO = {
  //       ...updateProductDTO,
  //       image: uploadResult.secure_url,
  //     };
  //     const updatedBook = await this.productModel.findByIdAndUpdate(
  //       id,
  //       newUpdateProductDTO,
  //       {
  //         new: true,
  //       },
  //     );
  //     return updatedBook;
  //   }

  async delete(id: string): Promise<any> {
    const existOrder = await this.orderModel.findById(id);
    if (existOrder.status !== 'pending') {
      throw new BadRequestException("You can't cancel this order");
    }
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status: Status.CANCELLED },
      {
        new: true,
      },
    );
    return order;
  }
}
