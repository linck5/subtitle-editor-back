import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchSchema } from './branch.schema';
import { TreeSchema } from '../tree/tree.schema';
import { UserSchema } from '../user/user.schema';
import { CollaboratorSchema } from './collaborator/collaborator.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchController } from './branch.controller';
import { PaginationService } from '../common/pagination.service';


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Branch', schema: BranchSchema },
        { name: 'Tree', schema: TreeSchema },
        { name: 'User', schema: UserSchema },
        { name: 'Collaborator', schema: CollaboratorSchema }
      ])
    ],
    providers: [BranchService, PaginationService],
    controllers: [BranchController],
    exports: [BranchService]
})
export class BranchModule {

}
