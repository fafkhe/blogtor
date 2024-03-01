import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { Me } from 'src/decorators/me.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { followlistQueryDto } from './dtos/followlistQueryDto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { LL_followDto } from './dtos/LL_folllow.dto';
import { handleRequestDto } from './dtos/handleRequest.dto';
import { unfollowDto } from './dtos/unfollow.dto';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(AuthGuard)
  @Get('/:id')
  follow(@Param('id') _id: string, @Me() me: UserDocument) {
    return this.followService.followAndUnfollow(_id, me);
  }

  @UseGuards(AuthGuard)
  @Serialize(LL_followDto)
  @Post('/getmyrequest')
  getMyFollowRequest(
    @Me() me: UserDocument,
    @Query() query: followlistQueryDto,
  ) {
    return this.followService.getMyFollowRequest(me, query);
  }

  @UseGuards(AuthGuard)
  @Post('handle_request')
  handleRequest(@Body() body: handleRequestDto, @Me() me: UserDocument) {
    return this.followService.handle(me, body);
  }

  @UseGuards(AuthGuard)
  @Delete('unfollow')
  unfollow(@Body() body: unfollowDto, @Me() me: UserDocument) {
    return this.followService.unfollow(me, body);
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  followRequest(@Param('id') _id: string, @Me() me: UserDocument) {
    return this.followService.request(_id, me);
  }
}
