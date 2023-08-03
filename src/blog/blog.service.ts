import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog ,BlogDocument} from 'src/schema/blog.schema';
import { Model } from 'mongoose';
import { createBlogDto } from './dto/createBlog.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';
import { ExtendedBlogDocument } from 'src/schema/blog.schema';
// import { LikeSchema } from 'src/schema/like.schema';
import { Like } from 'src/schema/like.schema';
import { User } from 'src/schema/user.schema';


@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog> , @InjectModel(Like.name) private likeModel: Model<Like > , @InjectModel(User.name) private userModel:Model<User> ) {}
  async createBlog(data:createBlogDto, me:UserDocument){
    if (!data.title || !data.content) throw new BadRequestException("insufficient input");
    const newBlog = await this.blogModel.create({ ...data, user: me._id });
    console.log("me", me)
    return newBlog;
  }
  
  async getAllBlogs(limit:8,page:0) {
    const count = await this.blogModel.find({}).countDocuments().exec();
    const allBlogs = await this.blogModel.find().limit(limit).skip(page).populate({ path: "user", select:{password:0 , __v:0}}).exec();
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
  async getSingleBlog(_id: string): Promise<ExtendedBlogDocument> {
    
    try {

      const singleBlog = await this.blogModel.findById(_id)
        .populate({ path: "user", select: { password: 0, __v: 0 } })
        .exec() as ExtendedBlogDocument;
      
      if (!singleBlog) throw new BadRequestException("no such blog found!!")
      
      // singleBlog.likeCount = 22
      singleBlog.likeCount = await  this.likeModel.find({blogId: singleBlog._id}).countDocuments()

      console.log(singleBlog,"/////")
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
   
   
    const count = await this.blogModel.find({user: me._id}).countDocuments();
   
   const myBlogs = await this.blogModel.find({ user: me._id }).limit(limit).skip(page).populate({ path: "user", select:{password:0 , __v:0}}).exec();
   if (!myBlogs) {
     throw new BadRequestException("no such blogs exist for this User!! ")
    }
   return {
     data: myBlogs,
     total: count
   }
 }
  
  async blogsByUser(_id:string ,page:number, limit:number , me:UserDocument ) {
    
    const thisUser = await this.userModel.findById(_id);
    if (!thisUser) throw new BadRequestException("no such user found!");

    const theseBlogs = await this.blogModel.find({ user: thisUser._id }).limit(limit).skip(page).populate({ path: "user", select: { password: 0, __v: 0 } }).exec();
    
    if (!theseBlogs) throw new BadRequestException("there is no blogs by this user exist !!");

    return theseBlogs;
  }
}