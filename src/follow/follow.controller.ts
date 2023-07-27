import { Controller,  Post , Body, Param , Get, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Me } from 'src/decorators/me.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { FollowDto } from './dtos/follow.dto';



@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) { }
  
  @UseGuards(AuthGuard)
  @Get("/:id")
  follow(@Param("id") _id:string , @Me() me: UserDocument ) {
    
    return this.followService.followAndUnfollow(_id , me);
  }

}
