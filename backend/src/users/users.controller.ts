import { Controller, Delete, Get } from '@nestjs/common';

@Controller('api/users')
export class UsersController {
  @Get('me') me() { return { id: 'stub-user' }; }
  @Delete('me') remove() { return { deleted: true }; }
  @Get('me/export') exportAll() { return { lectios: [] }; }
}
