import { Controller,Get,Post,Delete,Patch ,Body,UseGuards,Param} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';




@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/signup")
  async signup(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
    
  }
  
  @Post("/login")
  async login(@Body() body:CreateUserDto) {
    return await this.userService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/alluser')
  async allUser() {
    return await this.userService.getAllUser()
  }

  @Get("/:id")
  async singleUser(@Param('id') _id: string) {
    return await this.userService.getSingleUser(_id)
  }
}
