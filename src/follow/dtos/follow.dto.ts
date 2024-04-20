
import { IsString } from "class-validator";


export class FollowDto {

  @IsString()
  followeeId: string;

}

export class FollowingDto {

  @IsString()
  followerId: string;

}


