import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';



@Injectable()
export class BlogService {

  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) { }
  
  async createBlog(data:createBlogDto, me:UserDocument){
  
    if (!data.title || !data.content) throw new BadRequestException("insufficient input");
    const newBlog = await this.blogModel.create({ ...data, authorId: me._id });
    return newBlog;
  }

  async getAllBlogs() {
    const blogs = await this.blogModel.find({})
    return blogs;
  }
}
