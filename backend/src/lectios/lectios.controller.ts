import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';

@Controller('api/lectios')
export class LectiosController {
  @Get() list(@Query() query: any) { return { items: [], query }; }
  @Get(':id') get(@Param('id') id: string) { return { id }; }
  @Post() create(@Body() body: any) { return { id: 'new', ...body }; }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return { id, ...body }; }
  @Delete(':id') remove(@Param('id') id: string) { return { deletedId: id }; }
  @Patch(':id/favorite') favorite(@Param('id') id: string, @Body() body: any) { return { id, isFavorite: !!body.isFavorite }; }
  @Get(':id/export/markdown') exportMd(@Param('id') id: string) { return `# Lectio ${id}`; }
}
