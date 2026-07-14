import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from '@app/modules/search/elasticsearch.module';
import { UserSearchService } from './user-search.service';
import { UserReindexService } from './user-reindex.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SearchModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSearchService, UserReindexService],
  exports: [UsersService, UserSearchService, UserReindexService],
})
export class UsersModule {}
