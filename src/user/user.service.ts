import { Injectable } from '@nestjs/common';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create.user.dto';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }


  async createUser(data: CreateUserDto) {
    
    if (!data.email || !data.password || !data.name) {
      throw new BadRequestException("bad input")
    } 
      return await this.userModel.create(data)
  }
}
