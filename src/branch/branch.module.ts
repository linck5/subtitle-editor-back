import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchSchema } from './branch.schema';
import { TreeSchema } from '../tree/tree.schema';
import { UserSchema } from '../user/user.schema';
import { CollaboratorSchema } from './collaborator/collaborator.schema';
import { ChangeSchema } from '../change/change.schema';
import { CommitSchema } from '../commit/commit.schema';
import { BranchController } from './branch.controller';
import { PaginationService } from '../common/pagination.service';
import { RebaseService } from './rebasing/rebase.service';
import { RebaseController } from './rebasing/rebase.controller';
import { RebaseSchema } from './rebasing/rebase.schema';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';


@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(BranchSchema, "Branch"),
      getCollectionProvider(TreeSchema, "Tree"),
      getCollectionProvider(UserSchema, "User"),
      getCollectionProvider(CollaboratorSchema, "Collaborator"),
      getCollectionProvider(ChangeSchema, "Change"),
      getCollectionProvider(CommitSchema, "Commit"),
      getCollectionProvider(RebaseSchema, "Rebase"),
      BranchService,
      PaginationService,
      RebaseService
    ],
    controllers: [BranchController, RebaseController],
    exports: [BranchService]
})
export class BranchModule {

}
