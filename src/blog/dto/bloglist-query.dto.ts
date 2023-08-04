import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";


export class bloglistQueryDto {
  
  @Transform(({value}) => parseInt(value))
  @IsOptional()
  page: number;

  @Transform(({ value }) => {
    const x = parseInt(value)
    if (x > 50) return 50

    return x
  })
  @IsOptional()
  limit: number;

  @IsOptional()
  sort: 'latest' | 'oldest' | 'like'

}