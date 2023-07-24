import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog ,BlogDocument} from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';



@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async createBlog(data:createBlogDto, me:UserDocument){
    if (!data.title || !data.content) throw new BadRequestException("insufficient input");
    const newBlog = await this.blogModel.create({ ...data, authorId: me._id });
    return newBlog;
  }
  
  async getAllBlogs(limit:8,page:0) {
    const count = await this.blogModel.countDocuments({}).exec();
    const total = Math.floor((count - 1) / limit) + 1;
    const allBlogs = await this.blogModel.find().limit(limit).skip(page).exec();
    return {
      data: allBlogs,
      page_total:total,
    }
    
   
  }

  async updateBlogs(_id: string, data: createBlogDto, me: UserDocument): Promise<BlogDocument> {
    try {
      const blog = await this.blogModel.findById(_id)
      if (!blog) throw new BadRequestException("no such blog found")
    
      blog._checkIfImAuthor(me);
      const editedBlog = await this.blogModel.findByIdAndUpdate(blog._id, data);
      return editedBlog;
    } catch(error) {

      const obj = { 
        'CastError': new BadRequestException("no such blog found")
      }
      throw obj[error.name] || new InternalServerErrorException("oops,this is our fault")
    }
  
  }
  async getSingleBlog(_id: string) {
    
    try {

      const singleBlog = await this.blogModel.findById(_id)
      if (!singleBlog) throw new BadRequestException("no such blog found!!")
      
      return singleBlog;
    } catch (error) {

      const obj = {
        'CastError': new BadRequestException("no such blog found!!"),
      }

      throw obj[error.name] || new InternalServerErrorException('oops,this is our fault') 

    }
  }
  async deleteBlog(_id: string , me :UserDocument) {
    const blog = await this.blogModel.findById(_id);
    if (!blog) throw new BadRequestException("no such blog found!!")
    blog._checkIfImAuthor(me)
    await this.blogModel.findByIdAndDelete(blog._id)
    return {
      msg: "success..."
    }
  }


 async getMyBlogs( me:UserDocument, page:number, limit:number) {
   
    const count = await this.blogModel.countDocuments({}).exec();
    const total = Math.floor((count - 1) / limit) + 1;
   
   const myBlogs = await this.blogModel.find({ authorId: me._id }).limit(limit).skip(page).exec();
   if (!myBlogs) {
     throw new BadRequestException("no such blogs exist for this User ")
    }
   return {
     data: myBlogs,
     page_total: total
   }
  }
}
