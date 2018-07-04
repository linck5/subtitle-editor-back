import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
//import { DBConfigModule } from './dbConfig/dbConfig.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

import { BranchModule } from './branch/branch.module';
import { ChangeModule } from './change/change.module';
import { CommitModule } from './commit/commit.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { TreeModule } from './tree/tree.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [
      MongooseModule.forRoot(process.env.DB_CONN),
      AuthModule, UserModule, CommonModule, BranchModule, ChangeModule,
      CommitModule, SubtitleModule, TreeModule, VideoModule, CommentModule
    ]

})
export class ApplicationModule { }
