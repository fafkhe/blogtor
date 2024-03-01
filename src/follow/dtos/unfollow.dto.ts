import { UserDto } from 'src/user/dtos/user.dto';
import { IsString } from 'class-validator';

export class unfollowDto {
  @IsString()
  userId: string;
}
