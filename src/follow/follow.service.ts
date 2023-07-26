import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from 'src/schema/follow.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { User  } from 'src/schema/user.schema';

@Injectable()
export class FollowService {


  constructor(@InjectModel(Follow.name) private followModel: Model<Follow> , @InjectModel(User.name) private userModel: Model< User> ) { }
  
  async followUser(_id: string, me: UserDocument) {

    const thatPerson = await this.userModel.findById(_id);
    if (!thatPerson) throw new BadRequestException("no such user found");
    
     await this.followModel.create({ followerId: me._id, followeeId: thatPerson._id });

    
    return "ok"
  

  }
}
