import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CommentsModule } from './comments/comments.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from "cache-manager-redis-store";
import { CacheModule } from '@nestjs/cache-manager';
import { config } from 'dotenv';


config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI')
      })
    }),
    CacheModule.register({
      isGlobal: true,
      inject: [ConfigService],
      store: (): any => redisStore({
        commandsQueueMaxLength: 10_000,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT as any,
        }
      })
    }),
    UserModule,
    AuthModule,
    BlogModule,
    CommentsModule,
    FollowModule,
    LikeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
