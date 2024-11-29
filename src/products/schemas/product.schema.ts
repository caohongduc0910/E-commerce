import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from 'src/enums/category.enum';
import { Tag } from 'src/enums/tag.enum';
export type UserDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  salePrice: number;

  @Prop()
  image: string;

  @Prop()
  vendor: string;

  @Prop()
  category: Category;

  @Prop()
  tag: Tag;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
