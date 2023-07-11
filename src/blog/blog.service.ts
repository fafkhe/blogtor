import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException } from '@nestjs/common';



@Injectable()
export class BlogService {

  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  
  
  async createBlog(data:createBlogDto){
    const newBlog = await this.blogModel.create(data);
    if (!data.title || data.content) throw new BadRequestException("insufficient input");
  }
}
