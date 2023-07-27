import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument,Schema as MongooseSchema,Types } from "mongoose";


export type Followdocument = HydratedDocument<Follow>;


@Schema()
export class Follow {



  @Prop()
  followeeId: Types.ObjectId;


  @Prop()
  followerId: Types.ObjectId;


}

export const FollowSchema = SchemaFactory.createForClass(Follow);


