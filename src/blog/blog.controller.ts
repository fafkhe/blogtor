import { Controller,Post, Get,Delete,Patch, UseGuards, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Me } from 'src/decorators/me.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { createBlogDto } from './dto/createBlog.dto';


@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }
  
  @Post("/create")
  @UseGuards(AuthGuard)
  async createBlog(@Me() me:UserDocument, @Body() body:createBlogDto) {
    return this.blogService.createBlog(body, me)
  }
}
