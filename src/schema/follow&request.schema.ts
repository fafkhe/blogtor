import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';

export type Followdocument = HydratedDocument<Follow_Request>;


@Schema({ timestamps: true })
export class Follow_Request {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  requester: Types.ObjectId;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  target: Types.ObjectId;
}

export const FollowRequestSchema = SchemaFactory.createForClass(Follow_Request);
