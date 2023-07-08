import { IsEmail,IsString } from "@nestjs/class-validator";

export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsEmail()
  email: string;
}