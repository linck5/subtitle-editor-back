import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { CommentController } from './comment.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';


@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(CommentSchema, "Comment"),
      CommentService,
      PaginationService
    ],
    controllers: [CommentController],
    exports: [CommentService]
})
export class CommentModule {

}
