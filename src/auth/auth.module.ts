import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constanse';
import { jwtAuthMiddleware } from './jwtAuth.middleware';

@Module({
  imports: [
    UserModule, JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
  
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(jwtAuthMiddleware).forRoutes("*");
  }
}
