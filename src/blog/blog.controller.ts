import { Controller,Post, Get,Delete,Patch } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }
  

  @Post("/create")
  async createBlog() {
    
 


  }


}
