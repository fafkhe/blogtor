import { IsString } from "class-validator";



export class submitCommentsDto {

  
  @IsString()
  text: string;

  @IsString()
  blogId: string;

}