import { Injectable, Dependencies, Inject } from '@nestjs/common';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create.user.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { updateUserDto } from './dtos/updateUser.dto';
import { ExtendedUserDocument } from 'src/schema/user.schema';
import { Follow } from 'src/schema/follow.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { join } from 'path';
import { unlinkSync, createWriteStream, mkdirSync, existsSync } from 'fs';
import {
  resetPassword_stepOne_dto,
  resetPassword_stepThree_dto,
  resetPassword_stepTwo_dto,
} from './dtos/password.dto';
import { sendEmail } from '../mailer/mailer';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';

const UID = () => `${Date.now()}${String(Math.random()).slice(3, 8)}`;
const pathMaker = (filename: string): string =>
  join(process.cwd(), 'public', filename);
const removeFile = (path: string) => {
  try {
    unlinkSync(path);
  } catch (error) {}
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  #generateCode(length: number): string {
    const res = Array.from({ length }).reduce((acc) => {
      return acc + String(Math.floor(Math.random() * 9));
      return acc + '1';
    }, '');
    return String(res);
  }

  async readSingleUserFromCache(
    _id: string,
  ): Promise<ExtendedUserDocument | null> {
    try {
      let target = `user-${String(_id)}`;
      console.log(target, '//////////////');
      let thisUser = (await this.cacheManager.get(
        target,
      )) as ExtendedUserDocument;

      if (!thisUser) {
        thisUser = (await this.userModel.findById(_id)) as ExtendedUserDocument;
        if (thisUser) await this.cacheManager.set(target, thisUser);
      }

      return thisUser;
    } catch (error) {
      return null;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      if (!data.email || !data.password || !data.name) {
        throw new BadRequestException();
      }
      data.email = data.email.toLowerCase();

      const existingUser = await this.userModel.findOne({ email: data.email });
      console.log(existingUser, 'thisuser');

      if (existingUser)
        throw new BadRequestException('this User already exist');

      const thisUser = await this.userModel.create(data);

      const token = this.jwtService.sign({ _id: thisUser._id });

      return {
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async login(data: CreateUserDto) {
    if (!data.email || !data.password) {
      throw new BadRequestException('insufficient input');
    }
    const thisUser = await this.userModel.findOne({ email: data.email });
    if (!thisUser) {
      throw new BadRequestException('no such user found!!');
    }

    thisUser._checkPassword(data.password);

    const token = this.jwtService.sign({ _id: thisUser._id });
    return {
      token,
    };
  }

  async findById(_id: string) {
    try {
      const thisUser = await this.readSingleUserFromCache(_id);
      if (!thisUser)
        throw new BadRequestException('there is no user with this ID!!');

      thisUser.followerCount = await this.followModel
        .find({ followeeId: thisUser._id })
        .countDocuments();

      return thisUser;
    } catch (error) {
      const obj = {
        CastError: new BadRequestException('no such user found!!'),
      };
      throw (
        obj[error.name] ||
        new InternalServerErrorException('oops,this is our fault')
      );
    }
  }

  async getAllUser(limit: 8, page: 1) {
    const count = await this.userModel.countDocuments({}).exec();
    const total = Math.floor((count - 1) / limit) + 1;
    const users = await this.userModel.find().limit(limit).skip(page).exec();

    return {
      data: users,
      page_total: total,
    };
  }

  async updateMe(data: updateUserDto, me: UserDocument) {
    const thisUser = await this.userModel.findById(me._id);

    Object.entries(data).forEach(([key, value]) => {
      thisUser[key] = value;
    });
    await thisUser.save();

    let target = `user-${String(me._id)}`;
    await this.cacheManager.del(target);
    return {
      msg: 'successfully updated your data!!',
    };
  }

  async clearCache() {
    await this.cacheManager.reset();
    return 'ok!!';
  }

  async uploadAvatar(me: UserDocument, file: Express.Multer.File) {
    if (!existsSync(join(process.cwd(), 'public')))
      mkdirSync(join(process.cwd(), 'public'));

    const ext = file.mimetype.split('/')[1];
    const filename = `${UID()}.${ext}`;

    const path = pathMaker(filename);
    createWriteStream(path).write(Buffer.from(file.buffer));

    await this.userModel.findByIdAndUpdate(me._id, {
      $set: { avatar: filename },
    });

    let target = `user-${String(me._id)}`;
    await this.cacheManager.del(target);

    return 'ok';
  }

  async resetPass1(data: resetPassword_stepOne_dto) {
    const thisUser = await this.userModel.findOne({
      email: data.email,
    });
    if (!thisUser)
      throw new BadRequestException(
        'email doese not exist please make sure your email is correct',
      );
    const code = this.#generateCode(4);
    await this.cacheManager.set(`pchr-${data.email}`, code, 180 * 1000);

    sendEmail(data.email, code);
    return {
      statusCode: 200,
      msg: 'we will send a code to your email.',
    };
  }

  async resetPass2(data: resetPassword_stepTwo_dto) {
    const code = data.code;

    const thisUser = await this.userModel.findOne({
      email: data.email,
    });

    if (!thisUser)
      throw new BadRequestException(
        'email doese not exist please make sure your email is correct',
      );

    const theCode = await this.cacheManager.get(`pchr-${data.email}`);

    if (theCode !== code)
      throw new BadRequestException('the code is wrong, please try again!');

    await this.cacheManager.set(
      `permission-${data.email}`,
      theCode,
      180 * 1000,
    );

    return {
      statusCode: 200,
      msg: 'code is correct you can write your new password',
    };
  }

  async resetpass3(data: resetPassword_stepThree_dto) {

    const code = data.code;
    const email = data.email;
    const password = data.password;

    const thisUser = await this.userModel.findOne({
      email: email,
    });

    if (!thisUser)
      throw new BadRequestException(
        'email doese not exist please make sure your email is correct',
      );

    const theCode = await this.cacheManager.get(`permission-${data.email}`);

    if (!theCode)
      throw new BadRequestException('your time is over, please try again!');

    if (code !== theCode)
      throw new BadRequestException('the code is wrong, please try again!');

    const salt = genSaltSync(11);
    const hashPassword = hashSync(password, salt);


    await this.userModel.findByIdAndUpdate(thisUser.id, {
      password: hashPassword,
    });

    await this.cacheManager.del(`permission-${data.email}`);
  }
}
