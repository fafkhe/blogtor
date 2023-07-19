import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { UserModule } from 'src/user/user.module';
import { User,UserSchema } from 'src/schema/user.schema';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService]
})
export class BlogModule {}
