import {
  Controller, Get, Post, Delete, Patch, Body, UseGuards, Param,Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';




@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/signup")
   signup(@Body() body: CreateUserDto) {
    return  this.userService.createUser(body);
    
  }
  

  @Post("/login")
   login(@Body() body:CreateUserDto) {
    return  this.userService.login(body);
  }

  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Get('/alluser')
  allUser(@Query() {page,limit}) {
    return this.userService.getAllUser(page, limit);
  }
  
  @Serialize(UserDto)
  @Get("/:id")
  singleUser(@Param('id') _id:string) {
    return this.userService.findById(_id)
  }

  @Get("/cache/clear")
  clearCache() {
    return this.userService.clearCache()
  }
  
}
