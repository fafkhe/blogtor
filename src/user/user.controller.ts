import { Controller,Get,Post,Delete,Patch ,Body,UseGuards,Param} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { ObjectId } from 'mongoose';




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

  @UseGuards(AuthGuard)
  @Get('/alluser')
   allUser() {
    return  this.userService.getAllUser()
  }

  @Get("/:id")
   singleUser(@Param('id') _id:string) {
    return  this.userService.getSingleUser(_id)
  }
}
