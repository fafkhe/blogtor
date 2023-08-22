import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog ,BlogDocument} from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';
import { User } from 'src/schema/user.schema';
import { bloglistQueryDto } from './dto/bloglist-query.dto';

import { customSortType, SortObject } from './blog.service.types';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>
  ) { }
  
  async createBlog(data:createBlogDto, me:UserDocument){
    if (!data.title || !data.content) throw new BadRequestException("insufficient input");
    const newBlog = await this.blogModel.create({ ...data, user: me._id });
    console.log("me", me)
    return newBlog;
  }

  async getAllBlogs(query: bloglistQueryDto) {
    

    const page = query.page || 0 ;
    const limit = query.limit || 10;

    let defaultSort: SortObject = { createdAt: -1 }

    const obj: customSortType = {
      'latest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'like': { likeCount: -1 }
    }

    if (obj[query.sort]) defaultSort = obj[query.sort]

    const count = await this.blogModel.find({}).countDocuments().exec();
    const allBlogs = await this.blogModel.find().sort(defaultSort).limit(limit).skip(page).populate({ path: "user", select:{password:0 , __v:0}}).exec();
    return {
      data: allBlogs,
      total:count,
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
  async getSingleBlog(_id: string): Promise<BlogDocument> {
    
    try {

      const singleBlog = await this.blogModel.findById(_id).populate({ path: "user", select: { password: 0, __v: 0 } }).exec();
      
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


  async getMyBlogs(me: UserDocument, query: bloglistQueryDto) {

    const limit = query.limit || 10;
    
    const page = query.page || 0;

    let defaultSort: SortObject = { createdAt: -1 }

    const obj: customSortType = {
      'latest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'like': { likeCount: -1 }
    }
    if (obj[query.sort]) defaultSort = obj[query.sort]

    const count = await this.blogModel.find({ user: me._id }).countDocuments();
    
    const myBlogs = await this.blogModel
      .find({ user: me._id })
      .sort(defaultSort)
      .limit(limit)
      .skip(page)
      .populate({ path: "user", select: { password: 0, __v: 0 } })
      .exec();
    if (!myBlogs) throw new BadRequestException("no such blogs exist for this User!! ")
    
    return {
      data: myBlogs,
      total: count
    }
  }
  
  async blogsByUser(_id: string, query: bloglistQueryDto) {
    
    const limit = query.limit || 10;
    const page = query.page || 0;

    let defaultSort: SortObject = { createdAt: -1 }

    const obj: customSortType = {
      'latest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'like': { likeCount: -1 }
    }

    console.log(query)

    if (obj[query.sort]) defaultSort = obj[query.sort];

    const thisUser = await this.userModel.findById(_id);
    if (!thisUser) throw new BadRequestException("no such user found!");
    
    const count = await this.blogModel.find({ user: thisUser._id }).countDocuments();

    const theseBlogs = await this.blogModel
      .find({ user: thisUser._id })
      .sort(defaultSort)
      .limit(limit)
      .skip(page)
      .populate({ path: "user", select: { password: 0, __v: 0 } })
      .exec();
    
    if (!theseBlogs) throw new BadRequestException("there is no blogs by this user exist !!");

    return {
      data: theseBlogs,
      total: count,

    } 
  }
}