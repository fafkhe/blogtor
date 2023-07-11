import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';


@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost/blogtor'), UserModule, AuthModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
