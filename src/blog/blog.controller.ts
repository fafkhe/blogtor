import { Controller,Post, Get,Delete,Patch, UseGuards, Body, Param } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Me } from 'src/decorators/me.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { createBlogDto } from './dto/createBlog.dto';



@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}
  
  @Post("/create")
  @UseGuards(AuthGuard)
   createBlog(@Me() me:UserDocument, @Body() body:createBlogDto) {
    return this.blogService.createBlog(body, me)
  }

  @Get('/blogs')
  @UseGuards(AuthGuard)
  getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @UseGuards(AuthGuard)
  @Patch("/:id")
  updateBlogs(@Param('id') _id: string,@Body() body:createBlogDto, @Me() me:UserDocument,) {
   
    return this.blogService.updateBlogs(_id,body,me)
  }

  @UseGuards(AuthGuard)
  @Get("/single/:id")
  getSingleBlog(@Param("id") _id:string) {
    return this.blogService.getSingleBlog(_id);
  }

  @UseGuards(AuthGuard)
  @Delete("/:id")
  deleteBlog(@Me() me: UserDocument, @Param("id") _id:string) {
    return this.blogService.deleteBlog(_id,me);
    
  }

  @UseGuards(AuthGuard)
  @Get("my-blogs")
  getMyblogs(@Me() me: UserDocument) {
   
    return this.blogService.getMyBlogs(me)
  }
}
