import { Controller,Get,Post,Delete,Patch ,Body} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';





@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {
}

  @Post("/signup")
  async signup(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
    
  }


  @Post("/login")
  async login(@Body() body:CreateUserDto) {
    return await this.userService.login(body);
  }
}
