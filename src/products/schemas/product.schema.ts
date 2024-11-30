import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from 'src/enums/category.enum';
import { Collection } from 'src/enums/collection.enum';
export type ProductDocument = HydratedDocument<Product>;

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
  collection: Collection;

  @Prop({ type: [String], default: [] })
  tags: string[];

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
