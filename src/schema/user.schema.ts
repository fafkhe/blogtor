import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { compareSync, hashSync, genSaltSync } from "bcrypt";
import { BadRequestException, ConsoleLogger } from '@nestjs/common';



export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  
  @Prop()
  name: string;

  @Prop()
  email: string;
  

  @Prop()
  password: string;
  
  _checkPassword: Function
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.methods = {
  _checkPassword: function (password: string): void {

    if (!compareSync(password, this.password))
      throw new BadRequestException("password does not match!")
  
  }
}

