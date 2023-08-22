import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from 'src/schema/like.schema';
import { BlogModule } from 'src/blog/blog.module';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Blog.name, schema: BlogSchema }
    ]),
    BlogModule,
    UserModule
],
  controllers: [LikeController],
  providers: [LikeService]
})
export class LikeModule {}
