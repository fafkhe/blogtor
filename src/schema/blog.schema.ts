import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';


export type BlogDocument = HydratedDocument<Blog>

@Schema()
export class Blog {
  
  @Prop({ required: true })
  authorId: MongooseSchema.Types.ObjectId;  

  @Prop()
  title: string;

  @Prop()
  content: string;
  
  _checkIfImAuthor: Function
  // @Prop()
  // imgUrl: string; 
  
}

export const BlogSchema = SchemaFactory.createForClass(Blog);


BlogSchema.methods = {
  _checkIfImAuthor: function (thisUser: UserDocument): void {

    if (!this.authorId.equals(thisUser._id)) throw new BadRequestException("unathorized")
 
  },
}


