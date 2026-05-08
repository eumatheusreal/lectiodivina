import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsString, MinLength } from 'class-validator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';

class CreateLectioDto {
  @IsString() @MinLength(1) title!: string;
  @IsDateString() date!: string;
  @IsString() @MinLength(1) bibleReference!: string;
  @IsString() @MinLength(1) bibleText!: string;
  @IsString() @MinLength(1) promises!: string;
  @IsString() @MinLength(1) commands!: string;
  @IsString() @MinLength(1) eternalPrinciples!: string;
  @IsString() @MinLength(1) meditation!: string;
  @IsString() @MinLength(1) prayer!: string;
  @IsString() @MinLength(1) practicalApplication!: string;
  @IsArray() @ArrayMinSize(1) @IsString({ each: true }) tagIds!: string[];
  @IsBoolean() isFavorite!: boolean;
}

@Controller('api/lectios')
export class LectiosController {
  @Get() list(@Query() query: unknown) { return { items: [], query }; }
  @Get(':id') get(@Param('id') id: string) { return { id }; }
  @Post() create(@Body() body: CreateLectioDto) { return { id: 'new', ...body }; }
  @Put(':id') update(@Param('id') id: string, @Body() body: Partial<CreateLectioDto>) { return { id, ...body }; }
  @Delete(':id') remove(@Param('id') id: string) { return { deletedId: id }; }
  @Patch(':id/favorite') favorite(@Param('id') id: string, @Body() body: { isFavorite: boolean }) { return { id, isFavorite: !!body.isFavorite }; }
  @Get(':id/export/markdown') exportMd(@Param('id') id: string) { return `# Lectio ${id}`; }
}
