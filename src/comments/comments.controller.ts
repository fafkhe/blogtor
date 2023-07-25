import { Body, Controller, Param,UseGuards, Get , Query } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { submitCommentsDto } from './dtos/createComments.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { UserDocument } from 'src/schema/user.schema';
import { Me } from 'src/decorators/me.decorator';



@Controller('comments')
export class CommentsController {

  constructor( private CommentsService: CommentsService){}


  @Post("submit")
  @UseGuards(AuthGuard)
  submitComment( @Body() body: submitCommentsDto ,@Me() me:UserDocument) {
  
    return this.CommentsService.submitComments(body, me);

  }

  @Get("/:id")
  @UseGuards(AuthGuard)
  getComment(@Param("id") _id:string, @Query() {page, limit}  ) {
    
    return this.CommentsService.getComments(_id, page, limit)

  }

}
