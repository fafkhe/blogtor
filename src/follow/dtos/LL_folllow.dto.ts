import { Expose,Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { followRequestDto } from "./followRequest.dto";


export class LL_followDto {
  
  @Type(() => followRequestDto)
  @ValidateNested()
  @Expose()
  data: followRequestDto

  @Expose()
  total: followRequestDto

}