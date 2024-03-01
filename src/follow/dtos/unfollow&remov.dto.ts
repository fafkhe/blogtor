import { UserDto } from 'src/user/dtos/user.dto';
import { IsString } from 'class-validator';

export class unfollowRemoveDto {
  @IsString()
  userId: string;
}
