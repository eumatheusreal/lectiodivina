import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('api/tags')
export class TagsController {
  @Get() list() { return { items: [] }; }
  @Post() create(@Body() body: any) { return { id: 'tag', ...body }; }
  @Delete(':id') remove(@Param('id') id: string) { return { deletedId: id }; }
}
