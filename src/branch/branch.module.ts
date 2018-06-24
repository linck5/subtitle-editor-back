import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchSchema } from './branch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchController } from './branch.controller';
import { PaginationService } from '../common/pagination.service';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }])
    ],
    providers: [BranchService, PaginationService],
    controllers: [BranchController],
    exports: [BranchService]
})
export class BranchModule {

}
