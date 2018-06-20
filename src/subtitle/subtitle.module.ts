import { Module } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { SubtitleSchema } from './subtitle.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtitleController } from './subtitle.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Subtitle', schema: SubtitleSchema }])
    ],
    providers: [SubtitleService],
    controllers: [SubtitleController],
    exports: [SubtitleService]
})
export class SubtitleModule {

}
