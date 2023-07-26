import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CommentsModule } from './comments/comments.module';
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost/blogtor'), UserModule, AuthModule, BlogModule, CommentsModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
