import { IsString, IsOptional } from "class-validator";


export class updateUserDto { 
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  password: string;
}