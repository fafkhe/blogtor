import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from 'src/schema/follow.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { User } from 'src/schema/user.schema';
import { Follow_Request } from 'src/schema/follow&request.schema';
import { followlistQueryDto } from './dtos/followlistQueryDto';
import { SortObject } from 'src/blog/blog.service.types';
import { handleRequestDto } from './dtos/handleRequest.dto';
import { unfollowDto } from './dtos/unfollow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(Follow_Request.name)
    private followRequestModel: Model<Follow_Request>,

    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async followAndUnfollow(_id: string, me: UserDocument) {
    try {
      const thisUser = await this.userModel.findById(_id);
      if (!thisUser) throw new BadRequestException('no such user found');

      if (String(thisUser._id) === String(me._id))
        throw new BadRequestException('you can not follow yourself!!!');

      const thisFollow = await this.followModel.findOne({
        followerId: me._id,
        followeeId: thisUser._id,
      });

      const amIfollowing = Boolean(thisFollow);

      if (!amIfollowing) {
        await this.followModel.create({
          followerId: me._id,
          followeeId: thisUser._id,
        });
      } else {
        await this.followModel.findByIdAndDelete(thisFollow._id);
      }

      return amIfollowing
        ? 'successfully unfollowed this user'
        : 'successfully followed this user';
    } catch (error) {
      console.log(error.name);
      console.log(error);
    }
  }

  async request(_id: string, me: UserDocument) {
    try {
      const thisUser = await this.userModel.findById(_id);
      if (!thisUser) throw new BadRequestException('no such user found');

      const existingFollow = await this.followModel.findOne({
        followeeId: _id,
      });

      if (existingFollow)
        throw new BadRequestException('you can not follow this user!!');

      if (_id == String(me._id)) throw new BadRequestException('error');

      await this.followRequestModel.deleteMany({
        requester: me._id,
        target: _id,
      });

      await this.followRequestModel.create({
        requester: me._id,
        target: _id,
      });

      return 'ok';
    } catch (error) {
      console.log(error, 'error is here ');
      const obj = {
        CastError: new BadRequestException('no such user found!!'),
      };
      throw (
        obj[error.name] ||
        new InternalServerErrorException('oops,this is our fault')
      );
    }
  }

  async getMyFollowRequest(me: UserDocument, query: followlistQueryDto) {
    const limit = query.limit || 10;
    const page = query.page || 0;

    let defaultSort: SortObject = { createdAt: -1 };
    try {
      const findoptions = { target: me._id };
      const count = await this.followRequestModel
        .find(findoptions)
        .countDocuments();

      const user = await this.followRequestModel
        .find(findoptions)
        .sort(defaultSort)
        .limit(limit)
        .skip(page * limit)
        .populate([
          { path: 'requester', select: { password: 0, __v: 0 } },
          { path: 'target', select: { password: 0, __v: 0 } },
        ])
        .exec();

      return {
        data: user,
        total: count,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async handle(me: UserDocument, body: handleRequestDto) {
    const userId = body.userId;
    const isApproving = body.isapproving;

    const thisFollowRequest = await this.followRequestModel.findOne({
      requester: userId,
      target: me._id,
    });

    if (!thisFollowRequest) throw new BadRequestException();

    if (isApproving) {
      await this.followModel.create({
        followerId: userId,
        followeeId: me._id,
      });
    }
    await this.followRequestModel.findByIdAndDelete(thisFollowRequest._id);

    return 'ok';
  }

  async unfollow(me: UserDocument, body: unfollowDto) {
    const userId = body.userId;

    const thisFollow = await this.followModel.findOne({
      followeeId: userId,
      followerId: me._id,
    });

    if (!thisFollow) throw new BadRequestException('no such follow exists!!');

    await this.followModel.findByIdAndDelete(thisFollow._id);

    return 'ok';
  }
}
