import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";





export type Commentdocument = HydratedDocument<Comment>;

@Schema()
export class Comment{

  @Prop()
  text: string;

  @Prop()
  userId: string;

  @Prop()
  blogId: string;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);





