import { Body, Controller, Get, Post, Req } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  @Post('register') register(@Body() body: any) { return { message: 'register stub', body }; }
  @Post('login') login(@Body() body: any) { return { accessToken: 'stub' }; }
  @Post('logout') logout() { return { ok: true }; }
  @Post('refresh') refresh(@Req() req: any) { return { accessToken: 'new-stub' }; }
  @Get('me') me() { return { id: 'stub-user' }; }
}
