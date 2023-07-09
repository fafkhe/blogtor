import { Injectable, Dependencies } from '@nestjs/common';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create.user.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService:JwtService) {}
  
  async createUser(data: CreateUserDto) {
    
    data.email = data.email.toLowerCase()

    if (!data.email || !data.password || !data.name) {
      throw new BadRequestException()
    }

    const existingUser = await this.userModel.findOne({ email: data.email });

    if (existingUser) throw new BadRequestException('this User already exist');
    
    const thisUser = await this.userModel.create(data);

    const token = this.jwtService.sign({ id: thisUser._id });

    return {
      token
    }

  }
}
