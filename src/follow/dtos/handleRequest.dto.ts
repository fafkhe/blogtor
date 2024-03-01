import { UserDto } from 'src/user/dtos/user.dto';
import { IsString } from 'class-validator';

export class handleRequestDto {
  @IsString()
  userId: string;

  @IsString()
  isapproving: boolean;
}
