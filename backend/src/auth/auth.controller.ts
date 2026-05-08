import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { Allow, IsEmail, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

class LoginDto {
  @Allow()
  email?: string;

  @Allow()
  password?: string;
}

@Controller('api/auth')
export class AuthController {
  @Post('register') register(@Body() body: RegisterDto) { return { message: 'register stub', body }; }

  @Post('login')
  login(@Body() body: LoginDto) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }
    return { accessToken: 'stub' };
  }

  @Post('logout') logout() { return { ok: true }; }
  @Post('refresh') refresh(@Req() req: unknown) { return { accessToken: 'new-stub', req }; }
  @Get('me') me() { return { id: 'stub-user' }; }
}
