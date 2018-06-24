import { Module } from '@nestjs/common';
import { CommitService } from './commit.service';
import { CommitSchema } from './commit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitController } from './commit.controller';
import { PaginationService } from '../common/pagination.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Commit', schema: CommitSchema }])
    ],
    providers: [CommitService, PaginationService],
    controllers: [CommitController],
    exports: [CommitService]
})
export class CommitModule {

}
