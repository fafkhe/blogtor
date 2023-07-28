import { Controller , Get , Post , Param  , Body, UseGuards} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { UserDocument } from 'src/schema/user.schema';
import { createLikeDto } from './dtos/like.dto';
import { Me } from 'src/decorators/me.decorator';

@Controller('like')
export class LikeController {

  constructor(private likeService: LikeService) { }
  

  @UseGuards(AuthGuard)
  @Get("/submit")
  like(@Body() body:createLikeDto ,@Me()  me:UserDocument) {
    
    return this.likeService.LikeAndDisLike(body , me);
    
  }

}
