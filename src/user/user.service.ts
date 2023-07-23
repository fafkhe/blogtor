import { Injectable, Dependencies } from '@nestjs/common';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create.user.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { updateUserDto } from './dtos/updateUser.dto';


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

    const token = this.jwtService.sign({ _id: thisUser._id });

    return {
      token
    }

}

  async login(data: CreateUserDto) {
    if (!data.email || !data.password ) {
      throw new BadRequestException('insufficient input') 
    }
    const thisUser = await this.userModel.findOne({ email: data.email })
    if (!thisUser) {
      throw new BadRequestException("no such user found!!")
    }

     thisUser._checkPassword(data.password)
    
    const token = this.jwtService.sign({ _id: thisUser._id });
    return {
      token
    }
  }

  async findById(_id: string): Promise<UserDocument> {
    // todo: implement a cach mechanism here later
    const x = await this.userModel.findById(_id);
    return x;
  }

  async getAllUser() {
    const users = await this.userModel.find({})
    return users;
  }


  async getSingleUser(_id: string) {
   
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw  new BadRequestException("there is no user with this ID!!")
    }
    return user;
  }

  async updateMe(data:updateUserDto, me:UserDocument) {
    const editedUser = await this.userModel.findByIdAndUpdate(me._id, data);
    return {
      msg:"successfully updated your data!!"
    } 
  }
}
