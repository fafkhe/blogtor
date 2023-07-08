import { Controller,Get,Post,Delete,Patch ,Body} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';





@Controller('auth')
export class UserController {
constructor(private userService: UserService ){}

  @Post("/signup")
  async signup(@Body() body: CreateUserDto) {
    const user = await this.userService.createUser(body);
    return user
  }
  
}
