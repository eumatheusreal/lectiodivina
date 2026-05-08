import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LectiosModule } from './lectios/lectios.module';
import { TagsModule } from './tags/tags.module';

@Module({ imports: [AuthModule, UsersModule, LectiosModule, TagsModule] })
export class AppModule {}
