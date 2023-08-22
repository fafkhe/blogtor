import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { Like, LikeSchema } from 'src/schema/like.schema';
 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: Like.name, schema: LikeSchema }
    ]),
    UserModule,
  ],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService]
})
export class BlogModule {}
