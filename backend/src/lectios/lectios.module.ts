import { Module } from '@nestjs/common';
import { LectiosController } from './lectios.controller';

@Module({ controllers: [LectiosController] })
export class LectiosModule {}
