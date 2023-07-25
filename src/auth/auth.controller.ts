import { Controller , Get,Post, UseGuards,Body} from '@nestjs/common';
import { Me } from 'src/decorators/me.decorator';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { UserDocument } from 'src/schema/user.schema';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { UserService } from 'src/user/user.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from 'src/user/dtos/user.dto';

@Controller('auth')
export class AuthController {

   constructor(private userService :UserService ) {}
   @Get('me')
   @UseGuards(AuthGuard)
   @Serialize(UserDto)
   me(@Me() me: UserDocument) {
    
    return me;

  }
  @Post('update-me')
  @UseGuards(AuthGuard)
  updateMe(@Me() me:UserDocument , @Body() body:updateUserDto) {
    return this.userService.updateMe(body, me)
  }
  
}
