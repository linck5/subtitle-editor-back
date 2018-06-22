import { Module } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { AssString2SubtitleModelService } from './assConverter.service';
import { SubtitleSchema } from './subtitle.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtitleController } from './subtitle.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Subtitle', schema: SubtitleSchema }])
    ],
    providers: [SubtitleService, AssString2SubtitleModelService],
    controllers: [SubtitleController],
    exports: [SubtitleService]
})
export class SubtitleModule {

}
