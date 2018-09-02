import { Module } from '@nestjs/common';
import { TreeService } from './tree.service';
import { TreeSchema } from './tree.schema';
import { CommitSchema } from '../commit/commit.schema';
import { NodeSchema } from '../node/node.schema';
import { VideoSchema } from '../video/video.schema';
import { ChangeSchema } from '../change/change.schema';
import { RebaseSchema } from '../node/rebasing/rebase.schema';
import { CommentSchema } from '../comment/comment.schema';
import { UserSchema } from '../user/user.schema';
import { TreeController } from './tree.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(TreeSchema, "Tree"),
      getCollectionProvider(CommitSchema, "Commit"),
      getCollectionProvider(NodeSchema, "Node"),
      getCollectionProvider(VideoSchema, "Video"),
      getCollectionProvider(ChangeSchema, "Change"),
      getCollectionProvider(RebaseSchema, "Rebase"),
      getCollectionProvider(CommentSchema, "Comment"),
      getCollectionProvider(UserSchema, "User"),
      TreeService,
      PaginationService
    ],
    controllers: [TreeController],
    exports: [TreeService]
})
export class TreeModule {

}
