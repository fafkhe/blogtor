import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';
import { Me } from 'src/decorators/me.decorator';
import {
  resetPassword_stepOne_dto,
  resetPassword_stepTwo_dto,
  resetPassword_stepThree_dto,
} from './dtos/password.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Post('/login')
  login(@Body() body: CreateUserDto) {
    return this.userService.login(body);
  }

  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Get('/alluser')
  allUser(@Query() { page, limit }) {
    return this.userService.getAllUser(page, limit);
  }

  @Serialize(UserDto)
  @Get('/singleUser/:id')
  singleUser(@Param('id') _id: string) {
    return this.userService.findById(_id);
  }

  @Get('/cache/clear')
  clearCache() {
    return this.userService.clearCache();
  }

  @Post('/upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Me() me: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('salam');
    return this.userService.uploadAvatar(me, file);
  }

  @Post('resetpass1')
  reset_password_step_one(@Body() body: resetPassword_stepOne_dto) {
    return this.userService.resetPass1(body);
  }

  @Post('/resetpass2')
  resetPass2(@Body() body: resetPassword_stepTwo_dto) {
    return this.userService.resetPass2(body);
  }

  @Post('/resetpass3')
  resetPass3(@Body() body: resetPassword_stepThree_dto) {
    return this.userService.resetpass3(body);
  }
}
