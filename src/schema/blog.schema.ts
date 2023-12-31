import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema,Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';


export type BlogDocument = HydratedDocument<Blog>


@Schema({ timestamps: true })
export class Blog {

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'User' })
  user: Types.ObjectId
  
  _checkIfImAuthor: Function

  @Prop()
  likeCount: number;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
 
  
}

export const BlogSchema = SchemaFactory.createForClass(Blog);


BlogSchema.methods = {
  _checkIfImAuthor: function (thisUser: UserDocument): void {

    if (!this.authorId.equals(thisUser._id)) throw new BadRequestException("unathorized");
 
  },
}


