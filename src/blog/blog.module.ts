import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { UserModule } from 'src/user/user.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    UserModule
  ],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService]
})
export class BlogModule {}
