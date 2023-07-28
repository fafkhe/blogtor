import { IsString } from "class-validator";




export class createLikeDto {

  @IsString()
  blogId: string;
}