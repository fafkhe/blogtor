import {
  BadRequestException,
  ForbiddenException,
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
import { unfollowRemoveDto } from './dtos/unfollow&remov.dto';

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

  async unfollow(me: UserDocument, body: unfollowRemoveDto) {
    const userId = body.userId;

    const thisFollow = await this.followModel.findOne({
      followeeId: userId,
      followerId: me._id,
    });

    if (!thisFollow) throw new BadRequestException('no such follow exist!!');

    await this.followModel.findByIdAndDelete(thisFollow._id);

    return 'ok';
  }

  async remove(me: UserDocument, body: unfollowRemoveDto) {
    const userId = body.userId;

    const thisFollow = await this.followModel.findOne({
      followeeId: me._id,
      followerId: userId,
    });

    if (!thisFollow) throw new BadRequestException('no such user found!');

    await this.followModel.findByIdAndDelete(thisFollow._id);

    return 'ok';
  }

  async getFollowersById(
    me: UserDocument,
    userId: string,
    query: followlistQueryDto,
  ) {
    const limit = query.limit || 10;
    const page = query.page || 0;

    console.log('salam salam salam ');

    let defaultSort: SortObject = { createdAt: -1 };

    let shouldReturn = false;

    const findoptions = { followerId: me._id };
    const count = await this.followRequestModel
      .find(findoptions)
      .countDocuments();

    if (String(me._id) == userId) shouldReturn = true;

    if (shouldReturn === false) {
      const existingFollow = await this.followModel.findOne({
        followeeId: userId,
        followerId: me._id,
      });

      if (existingFollow) shouldReturn = true;
    }
    if (!shouldReturn) throw new ForbiddenException();

    const followers = await this.followModel
      .find({
        followeeId: userId,
      })
      .sort(defaultSort)
      .limit(limit)
      .skip(page * limit)
      .populate([{ path: 'followerId', select: { password: 0, __v: 0 } }])
      .exec();

    console.log(followers, 'followers');

    return {
      data: followers,
      total: count
    };
  }
}
