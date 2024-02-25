import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/user/dtos/user.dto';
import { ValidateNested } from 'class-validator';

export class followRequestDto {

  @Expose()
  @Type(() => UserDto)
  @ValidateNested()
  readonly requester: UserDto;

  @Expose()
  @Type(() => UserDto)
  @ValidateNested()
  readonly target: UserDto;
}
