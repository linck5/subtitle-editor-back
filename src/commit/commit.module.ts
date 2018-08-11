import { Module } from '@nestjs/common';
import { CommitService } from './commit.service';
import { CommitSchema } from './commit.schema';
import { CommitController } from './commit.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(CommitSchema, "Commit"),
      CommitService,
      PaginationService
    ],
    controllers: [CommitController],
    exports: [CommitService]
})
export class CommitModule {

}
