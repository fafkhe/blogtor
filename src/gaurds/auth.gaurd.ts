import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    console.log('first of gaurd');

    const request = context.switchToHttp().getRequest();

    const requester = request.requester;

    if (!requester || !requester._id) return false;

    const thisUser = await this.userService.findById(requester._id);

    console.log(thisUser, 'thisuser');

    console.log('last  of gaurd_1');

    if (!thisUser) return false;
    request.me = thisUser;

    console.log('last  of gaurd_23');

    return true;
  }
}
