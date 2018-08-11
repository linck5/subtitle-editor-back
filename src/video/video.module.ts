import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoSchema } from './video.schema';
import { VideoController } from './video.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(VideoSchema, "Video"),
      VideoService,
      PaginationService
    ],
    controllers: [VideoController],
    exports: [VideoService]
})
export class VideoModule {

}
