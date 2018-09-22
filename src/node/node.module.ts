import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeSchema } from './node.schema';
import { TreeSchema } from '../tree/tree.schema';
import { UserSchema } from '../user/user.schema';
import { CollaboratorSchema } from './collaborator/collaborator.schema';
import { ChangeSchema } from '../change/change.schema';
import { CommitSchema } from '../commit/commit.schema';
import { SubtitleSchema } from '../subtitle/subtitle.schema';
import { NodeController } from './node.controller';
import { PaginationService } from '../common/pagination.service';
import { RebaseService } from './rebasing/rebase.service';
import { RebaseController } from './rebasing/rebase.controller';
import { RebaseSchema } from './rebasing/rebase.schema';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';


@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(NodeSchema, "Node"),
      getCollectionProvider(TreeSchema, "Tree"),
      getCollectionProvider(UserSchema, "User"),
      getCollectionProvider(CollaboratorSchema, "Collaborator"),
      getCollectionProvider(ChangeSchema, "Change"),
      getCollectionProvider(CommitSchema, "Commit"),
      getCollectionProvider(SubtitleSchema, "Subtitle"),
      getCollectionProvider(RebaseSchema, "Rebase"),
      NodeService,
      PaginationService,
      RebaseService
    ],
    controllers: [NodeController, RebaseController],
    exports: [NodeService]
})
export class NodeModule {

}
