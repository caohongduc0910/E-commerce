import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  dob: Date;

  @Prop()
  address: string;

  @Prop()
  role: Role;

  @Prop()
  codeId: String;

  @Prop()
  codeIdExpiresAt: Date;

  @Prop({ default: false })
  active: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
