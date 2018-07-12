import { Module } from '@nestjs/common';
import { TreeService } from './tree.service';
import { TreeSchema } from './tree.schema';
import { CommitSchema } from '../commit/commit.schema';
import { BranchSchema } from '../branch/branch.schema';
import { VideoSchema } from '../video/video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TreeController } from './tree.controller';
import { PaginationService } from '../common/pagination.service';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Tree', schema: TreeSchema },
        { name: 'Commit', schema: CommitSchema },
        { name: 'Branch', schema: BranchSchema },
        { name: 'Video', schema: VideoSchema }
      ])
    ],
    providers: [TreeService, PaginationService],
    controllers: [TreeController],
    exports: [TreeService]
})
export class TreeModule {

}
