import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { PaginationService } from '../common/pagination.service';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }])
    ],
    providers: [CommentService, PaginationService],
    controllers: [CommentController],
    exports: [CommentService]
})
export class CommentModule {

}
