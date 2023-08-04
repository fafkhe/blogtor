import { Expose,Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { blogDto } from "./blog.dto";


export class LL_BlogDto {
  
  @Type(() => blogDto)
  @ValidateNested()
  @Expose()
  data: blogDto

  @Expose()
  total: number

}