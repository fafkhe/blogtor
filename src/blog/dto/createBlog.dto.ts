import { IsString } from "class-validator";



export class createBlogDto { 
  @IsString()
  title: string;
  @IsString()
  content: string;
  

}
