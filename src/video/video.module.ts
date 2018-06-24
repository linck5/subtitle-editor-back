import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoSchema } from './video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoController } from './video.controller';
import { PaginationService } from '../common/pagination.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }])
    ],
    providers: [VideoService, PaginationService],
    controllers: [VideoController],
    exports: [VideoService]
})
export class VideoModule {

}
