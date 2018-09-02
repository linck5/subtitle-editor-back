import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NodeModule } from './node/node.module';
import { ChangeModule } from './change/change.module';
import { CommitModule } from './commit/commit.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { TreeModule } from './tree/tree.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [
      AuthModule, UserModule, CommonModule, NodeModule, ChangeModule,
      CommitModule, SubtitleModule, TreeModule, VideoModule, CommentModule
    ]

})
export class ApplicationModule { }
