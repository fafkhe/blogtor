import { Injectable, InternalServerErrorException ,Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/schema/comment.schema';
import { Model } from 'mongoose';
import { submitCommentsDto } from './dtos/createComments.dto'; 
import { Blog } from 'src/schema/blog.schema';
import { UserDocument } from 'src/schema/user.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commenModel: Model<Comment>, @InjectModel(Blog.name) private blogModel: Model<Blog> ) { }
  
 
  async submitComments(data: submitCommentsDto, me: UserDocument) {
    
    

    try {

      if (!data.text.trim()) throw new BadRequestException("text is required");
      const thisBlog = await this.blogModel.findById(data.blogId);
      if (!thisBlog) throw new BadRequestException("no such blog found!!");
      await this.commenModel.create({ text: data.text, blogId: thisBlog._id, userId: me._id });
    
      return "ok success"

    } catch (error) {
      console.log(error)
      if (error.name === "CastError") throw new BadRequestException("no such blog found");
      throw error
    }

  }

  async getComments(_id: string , page:1 , limit:8) {
    
    const thisBlog = await this.blogModel.findById(_id);
    if (!thisBlog) throw new BadRequestException("no such blog found!!");
    const count = await this.commenModel.countDocuments({}).exec();

    const comments = await this.commenModel.find({ blogId: _id }).limit(limit).skip(page).populate({ path: "user", select: { password: 0, __v: 0 } }).exec();


    return {
      data: comments,
      total:count,
    }

  }

  
}
