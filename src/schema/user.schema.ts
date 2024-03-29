import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { compareSync, hashSync, genSaltSync } from "bcrypt";
import { BadRequestException } from '@nestjs/common';

@Schema()
export class User {
  
  @Prop()
  name: string;

  @Prop()
  email: string;
  
  @Prop()
  password: string;

  @Prop()
  avatar: string;

  _checkPassword: Function
}

export type UserDocument = HydratedDocument<User>;

export interface ExtendedUserDocument extends UserDocument {
  followerCount: number
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();
  const salt = genSaltSync(11);
  const hash = hashSync(this.password, salt);
  this.password = hash;
  next();
 
});

UserSchema.methods = {
  _checkPassword: function (password: string): void {
    if (!compareSync(password, this.password))
      throw new BadRequestException("password does not match!")
  
  }
}

