import { Controller , Get,Post, UseGuards} from '@nestjs/common';
import { Me } from 'src/decorators/me.decorator';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { UserDocument } from 'src/schema/user.schema';

@Controller('auth')
export class AuthController {

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Me() me:UserDocument) {
    return me;
  }
  

}
