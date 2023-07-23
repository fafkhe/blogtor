import {
  Controller, Get, Post, Delete, Patch, Body, UseGuards, Param,
  UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptors';



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

  @UseInterceptors(SerializeInterceptor)
  @UseGuards(AuthGuard)
  @Get('/alluser')
  allUser() {
    return  this.userService.getAllUser()
  }
  
  @UseInterceptors(SerializeInterceptor)
  @Get("/:id")
   singleUser(@Param('id') _id:string) {
    return  this.userService.getSingleUser(_id)
  }
}
