import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schema/comment.schema';
import { BlogModule } from 'src/blog/blog.module';
import { Blog , BlogSchema } from 'src/schema/blog.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    BlogModule,
    UserModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])

  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
