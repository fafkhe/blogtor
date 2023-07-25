import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema,Types } from 'mongoose';






export type Commentdocument = HydratedDocument<Comment>;

@Schema()
export class Comment{

  @Prop()
  text: string;

  @Prop()
  userId: string;

  @Prop()
  blogId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'User' })
  user: Types.ObjectId

}

export const CommentSchema = SchemaFactory.createForClass(Comment);





