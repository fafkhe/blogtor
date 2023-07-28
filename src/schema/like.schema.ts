import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema ,Types } from 'mongoose';




export type Likedocument = HydratedDocument<Like>;


@Schema()
export class Like {

  @Prop()
  userId: Types.ObjectId;


  @Prop()
  blogId: Types.ObjectId;

}

export const LikeSchema = SchemaFactory.createForClass(Like);