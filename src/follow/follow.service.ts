import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from 'src/schema/follow.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { User } from 'src/schema/user.schema';



@Injectable()
export class FollowService {


  constructor(@InjectModel(Follow.name) private followModel: Model<Follow> , @InjectModel(User.name) private userModel: Model< User> ) { }
  

  async followAndUnfollow(_id: string, me: UserDocument) {
    try {
      
      const thisUser = await this.userModel.findById(_id);
      if (!thisUser) throw new BadRequestException("no such user found");

      if (String(thisUser._id) === String(me._id)) throw new BadRequestException("you can not follow yourself!!!");
      
      const thisFollow = await this.followModel.findOne({ followerId: me._id, followeeId: thisUser._id });
      
      const amIfollowing = Boolean(thisFollow);
  
      if (!amIfollowing) {
        await this.followModel.create({ followerId: me._id, followeeId: thisUser._id });
      } else {
        await this.followModel.findByIdAndDelete(thisFollow._id);
      }
  
      return amIfollowing ? 'successfully unfollowed this user' : 'successfully followed this user'
    
    } catch (error) {
      console.log(error.name)
      console.log(error)
      
    }
  }
}
