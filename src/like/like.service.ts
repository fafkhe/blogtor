import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from 'src/schema/like.schema';
import { UserDocument } from 'src/schema/user.schema';
import { Blog } from 'src/schema/blog.schema';
import { createLikeDto } from './dtos/like.dto';


@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>
  ) { }
  

  async LikeAndDisLike( data:createLikeDto , me: UserDocument) {
    
    const thisBlog = await this.blogModel.findById(data.blogId)
    if (!thisBlog) throw new BadRequestException("no such blog found!!");
    
    const thisLike = await this.likeModel.findOne({ userId: me._id, blogId: thisBlog._id })
    
    if (!thisLike) {
     await this.likeModel.create({ userId: me._id , blogId: thisBlog._id })
    } else {
      await this.likeModel.findByIdAndDelete(thisLike._id)
    }

    const likeCount = await this.likeModel.find({ blogId: thisBlog._id }).countDocuments();

    await this.blogModel.findByIdAndUpdate(thisBlog._id,{ likeCount:likeCount })

    return "ok"


  }


}
