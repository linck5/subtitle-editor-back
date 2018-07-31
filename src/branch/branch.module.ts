import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchSchema } from './branch.schema';
import { TreeSchema } from '../tree/tree.schema';
import { UserSchema } from '../user/user.schema';
import { CollaboratorSchema } from './collaborator/collaborator.schema';
import { ChangeSchema } from '../change/change.schema';
import { CommitSchema } from '../commit/commit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchController } from './branch.controller';
import { PaginationService } from '../common/pagination.service';
import { RebaseService } from './rebasing/rebase.service';
import { RebaseController } from './rebasing/rebase.controller';
import { RebaseSchema } from './rebasing/rebase.schema';


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Branch', schema: BranchSchema },
        { name: 'Tree', schema: TreeSchema },
        { name: 'User', schema: UserSchema },
        { name: 'Collaborator', schema: CollaboratorSchema },
        { name: 'Change', schema: ChangeSchema },
        { name: 'Commit', schema: CommitSchema },
        { name: 'Rebase', schema: RebaseSchema }
      ])
    ],
    providers: [BranchService, PaginationService, RebaseService],
    controllers: [BranchController, RebaseController],
    exports: [BranchService]
})
export class BranchModule {

}
