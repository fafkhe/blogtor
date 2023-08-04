import { Controller,Post, Get,Delete,Patch, UseGuards, Body, Param,Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Me } from 'src/decorators/me.decorator';
import { User, UserDocument } from 'src/schema/user.schema';
import { createBlogDto } from './dto/createBlog.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { blogDto } from './dto/blog.dto';
import { bloglistQueryDto } from './dto/bloglist-query.dto';
import { LL_BlogDto } from './dto/LL_blog.dto';


@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }
  
  @Post("/create")
  @UseGuards(AuthGuard)
  createBlog(@Me() me: UserDocument, @Body() body: createBlogDto) {
    return this.blogService.createBlog(body, me)
  }

  @Get('/blogs')
  @Serialize(LL_BlogDto)
  getAllBlogs(@Query() query:bloglistQueryDto) {
    return this.blogService.getAllBlogs(query);
  }

  @UseGuards(AuthGuard)
  @Patch("/update/:id")
  updateBlogs(@Param('id') _id: string, @Body() body: createBlogDto, @Me() me: UserDocument,) {
   
    return this.blogService.updateBlogs(_id, body, me)
  }

  @Get("/single/:id")
  @Serialize(blogDto)
  getSingleBlog(@Param("id") _id: string) {
    return this.blogService.getSingleBlog(_id);
  }
  
  @Delete("/:id")
  @UseGuards(AuthGuard)
  deleteBlog(@Me() me: UserDocument, @Param("id") _id: string) {
    return this.blogService.deleteBlog(_id, me);
    
  }

  @Get("my-blogs")
  @UseGuards(AuthGuard)
  @Serialize(LL_BlogDto)
  getMyblogs(@Me() me: UserDocument, @Query() query: bloglistQueryDto) {
   
    return this.blogService.getMyBlogs(me, query);
  }

  @Post("/blogsbyuser")
  @Serialize(LL_BlogDto)
  blogByUser(@Body() _id: string, @Query() query: bloglistQueryDto) {
    return this.blogService.blogsByUser(_id, query);
    
  }
}
