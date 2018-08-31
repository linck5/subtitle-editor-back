import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { ChangeSchema } from './change.schema';
import { BranchSchema } from '../branch/branch.schema';
import { TreeSchema } from '../tree/tree.schema';
import { ChangeController } from './change.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(ChangeSchema, "Change"),
      getCollectionProvider(BranchSchema, "Branch"),
      getCollectionProvider(TreeSchema, "Tree"),
      ChangeService,
      PaginationService
    ],
    controllers: [ChangeController],
    exports: [ChangeService]
})
export class ChangeModule {

}
