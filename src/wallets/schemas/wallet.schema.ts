/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({
  timestamps: true,
})
export class Wallet {
  @Prop()
  userId: string;

  @Prop()
  address: string;

  @Prop()
  balance: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
