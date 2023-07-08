import { IsEmail,IsString } from "@nestjs/class-validator";

export class CreateUserDto {
  @IsString()
  password: string;
  @IsEmail()
  email: string;
}