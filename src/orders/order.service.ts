import mongoose, { Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDTO } from './dto/create-order.dto';
import { User } from 'src/users/schemas/user.schema';
import { QueryOrderDTO } from './dto/query-order.dto';
import { OrderQuery } from 'src/common/interfaces/query.interface';
import {
  calculateOffset,
  calculateTotalPages,
} from 'src/helpers/pagination.helper';
import { Status } from 'src/enums/status.enum';
import { Delivery } from 'src/enums/delivery.enum';
import { Role } from 'src/enums/role.enum';
import { Product } from 'src/products/schemas/product.schema';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: mongoose.Model<Order>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
    private stripeService: StripeService,
  ) {}

  async findById(id: string, userID: string, role: string): Promise<any> {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'id')
      .exec();
    if (userID !== (order.userId as any)._id.toString() && role != Role.ADMIN) {
      throw new BadRequestException("You can't access this endpoint");
    }
    return order;
  }

  async findByUserId(id: string): Promise<any> {
    const order = await this.orderModel.find({
      userId: id,
    });
    return order;
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
      this.orderModel
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', 'avatar firstName'),
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

    const user = await this.userModel.findById(id);

    const { products, deliveryOption } = createOrderDTO;

    const productIds = products.map((product) => product.productId);

    const results = await this.productModel.find({ _id: { $in: productIds } });

    // So sánh số lượng sản phẩm
    if (results.length !== products.length) {
      throw new BadRequestException('One or more products do not exist!');
    }

    const updatedProducts = products.map((product, index) => {
      const dbProduct = results[index];
      const title = dbProduct.title;
      const image = dbProduct.image;
      const category = dbProduct.category;
      const price = dbProduct.salePrice || dbProduct.price;
      const itemSubtotal = price * product.quantity;

      return {
        ...product,
        title,
        image,
        category,
        price,
        itemSubtotal,
      };
    });

    // console.log(updatedProducts);

    const subtotal = updatedProducts.reduce(
      (sum, product) => sum + product.itemSubtotal,
      0,
    );

    let deliveryFee = 100;
    if (deliveryOption === Delivery.EXPRESS) {
      deliveryFee = 200;
    }
    const discount = 0.2 * subtotal;
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal + tax + deliveryFee - discount;

    const newCreateOrderDTO = {
      userId: id,
      name: user.firstName + ' ' + user.lastName,
      products: updatedProducts,
      deliveryOption: deliveryOption,
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
    };
    const newOrder = await this.orderModel.create(newCreateOrderDTO);

    const session = await this.stripeService.createCheckoutSession(
      updatedProducts,
      newOrder.id,
    );

    return {
      order: newOrder,
      url: session.url,
    };
  }

  async delete(id: string, userID: string): Promise<any> {
    const existOrder = await this.orderModel
      .findById(id)
      .populate('userId', 'id')
      .exec();

    // console.log(userID);
    // console.log((existOrder.userId as any)._id);

    if (userID !== (existOrder.userId as any)._id.toString()) {
      throw new BadRequestException("You can't access this endpoint");
    }

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

  async getOrderStatsByUserId(
    userId: string,
  ): Promise<{ totalOrders: number; totalAmount: number }> {
    const result = await this.orderModel.aggregate([
      {
        $match: {
          userId: userId,
          // status: Status.CONFIRMED
          status: { $ne: Status.CANCELLED },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    return result.length > 0
      ? {
          totalOrders: result[0].totalOrders,
          totalAmount: result[0].totalAmount,
        }
      : { totalOrders: 0, totalAmount: 0 };
  }
}
