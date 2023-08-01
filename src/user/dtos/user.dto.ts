import { Expose } from "class-transformer";

export class UserDto {
  @Expose()
  _id:string
  @Expose()
  name: string
  @Expose()
  email: string;

  @Expose()
  followerCount: number
 }