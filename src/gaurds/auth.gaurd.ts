import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
  
export class AuthGuard implements CanActivate {

  constructor(private readonly userService: UserService) { }
  
  async canActivate(context: ExecutionContext) {

    const request = context.switchToHttp().getRequest();

    const requester = request.requester;

    if (!requester || !requester._id) return false;

    const thisUser = await this.userService.findById(requester._id)
  
   

 
    if (!thisUser) return false;  
    request.me = thisUser
  
    return true;
  }

}