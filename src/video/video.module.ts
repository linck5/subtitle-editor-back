import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoSchema } from './video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoController } from './video.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }])
    ],
    providers: [VideoService],
    controllers: [VideoController],
    exports: [VideoService]
})
export class VideoModule {

}
