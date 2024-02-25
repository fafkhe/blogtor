import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from 'src/schema/follow.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { Follow_Request } from 'src/schema/follow&request.schema';
import { FollowRequestSchema } from 'src/schema/follow&request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Follow_Request.name, schema: FollowRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
