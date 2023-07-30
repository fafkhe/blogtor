import { Expose } from "class-transformer";

export class blogDto {
  @Expose()
  id:string
  @Expose()
  totle: string
  @Expose()
  content: string;

  @Expose()
  likeCount: number
 }