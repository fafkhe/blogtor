import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BadRequestException } from '@nestjs/common';



export type BlogDocument = HydratedDocument<Blog>



@Schema()
export class Blog {
  
  @Prop({required:true})
  authorId: string;  

  @Prop()
  title: string;

  @Prop()
  content: string;


  // @Prop()
  // imgUrl: string; 

}

export const BlogSchema = SchemaFactory.createForClass(Blog);



