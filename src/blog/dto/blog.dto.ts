import { Expose,Type } from "class-transformer";
import { UserDto } from "src/user/dtos/user.dto";
import { ValidateNested } from "class-validator";


export class blogDto {
  
  @Expose()
  id: string
  
  @Expose()
  totle: string

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserDto)
  @ValidateNested()
  readonly user: UserDto

  @Expose()
  likeCount: number;

 }