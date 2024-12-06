import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Type } from 'src/enums/type.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Type.CUSTOM })
  type: Type;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
