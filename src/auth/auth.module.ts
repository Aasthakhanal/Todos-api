import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TodosService } from 'src/todos/todos.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '15d'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,
    PrismaService,
    TodosService,
    UsersService],
})
export class AuthModule {}
