import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { AssChangeService } from './ass/assChange.service';
import { ChangeSchema } from './change.schema';
import { NodeSchema } from '../node/node.schema';
import { TreeSchema } from '../tree/tree.schema';
import { ChangeController } from './change.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(ChangeSchema, "Change"),
      getCollectionProvider(NodeSchema, "Node"),
      getCollectionProvider(TreeSchema, "Tree"),
      ChangeService,
      AssChangeService,
      PaginationService
    ],
    controllers: [ChangeController],
    exports: [ChangeService, AssChangeService]
})
export class ChangeModule {

}
