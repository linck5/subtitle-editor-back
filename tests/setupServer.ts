import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Test } from '@nestjs/testing';


import { SubtitleModule } from '../src/subtitle/subtitle.module';
import { UserModule } from '../src/user/user.module';
import { BranchModule } from '../src/branch/branch.module';
import { ChangeModule } from '../src/change/change.module';
import { CommitModule } from '../src/commit/commit.module';
import { TreeModule } from '../src/tree/tree.module';
import { VideoModule } from '../src/video/video.module';
import { CommentModule } from '../src/comment/comment.module';
import { CommonModule } from '../src/common/common.module';

import { DTOValidationPipe } from '../src/common/dtoValidation.pipe';
import { NumberParserPipe } from '../src/common/parsers/numberParser.pipe';
import { BooleanParserPipe } from '../src/common/parsers/booleanParser.pipe';
import { LowercaseReqKeysPipe } from '../src/common/lowercaseReqKeys.pipe';


export async function getNestMongoApp(){

  const server = express();
  server.use(bodyParser.json());

  const module = await Test.createTestingModule({
      imports: [UserModule, BranchModule, ChangeModule,
      CommitModule, SubtitleModule, TreeModule, VideoModule, CommentModule,
      CommonModule],
    })
    .compile();

  const app = module.createNestApplication(server);
  app.useGlobalPipes(
    new LowercaseReqKeysPipe(),
    new NumberParserPipe(),
    new BooleanParserPipe(),
    new DTOValidationPipe()
  );
  await app.init();

  return server;

}
