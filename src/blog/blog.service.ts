import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog ,BlogDocument} from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';



@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async createBlog(data:createBlogDto, me:UserDocument){
    if (!data.title || !data.content) throw new BadRequestException("insufficient input");
    const newBlog = await this.blogModel.create({ ...data, authorId: me._id });
    return newBlog;
  }

  async getAllBlogs() {
    const blogs = await this.blogModel.find({})
    return blogs;
  }

  async updateBlogs(_id: string, data: createBlogDto, me: UserDocument): Promise<BlogDocument> {
    const blog = await this.blogModel.findById(_id)
    if (!blog) {
      throw new  BadRequestException("no such blog found")
    }
    blog._checkIfImAuthor(me);
    const editedBlog = await this.blogModel.findByIdAndUpdate(blog._id, data);
    return editedBlog;
  
  }
  async getSingleBlog(_id:string) {
    const singleBlog = await this.blogModel.findById(_id)
    if (!singleBlog) {
      throw new BadRequestException("no such blog found!!")
    }
    return singleBlog;
  }
  async deleteBlog(_id: string , me :UserDocument) {
    const blog = await this.blogModel.findById(_id);
    if (!blog) {
      throw new BadRequestException("no such blog found!!")
    }
    blog._checkIfImAuthor(me)
    const thisBlog = await this.blogModel.findByIdAndDelete(blog._id)
    return {
      msg:"success"
    }
  }

}
