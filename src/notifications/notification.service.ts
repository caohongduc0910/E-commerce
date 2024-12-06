import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import mongoose from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    @InjectModel(Notification.name)
    private notificationModel: mongoose.Model<Notification>,
  ) {}

  async findById(id: string, userId: string): Promise<any> {
    const notification = await this.notificationModel.findById(id);
    if (!notification)
      throw new BadRequestException("Notification doesn't exist");

    if (notification.userId !== userId)
      throw new BadRequestException("You can't access this endpoint");

    return notification;
  }

  async findAll(userId: string): Promise<any> {
    const notification = await this.notificationModel
      .find({
        userId: userId,
      })
      .sort({
        createdAt: -1,
      });

    return notification;
  }

  async create(
    userId: string,
    title: string,
    message: string,
    type: string,
  ): Promise<any> {
    const notification = await this.notificationModel.create({
      userId: userId,
      title: title,
      message: message,
      type: type,
    });

    return notification;
  }

  async update(id: string, userId: string): Promise<any> {
    const notification = await this.notificationModel.updateOne(
      {
        id: id,
        userId: userId,
      },
      {
        isRead: true,
      },
    );

    return notification;
  }

  async delete(id: string, userId: string): Promise<any> {
    const notification = await this.notificationModel.updateOne(
      {
        id: id,
        userId: userId,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    return notification;
  }

  sendNotification(id: string, event: string, payload: any): void {
    this.notificationGateway.sendOrderNotification(id, event, payload);
  }
}
