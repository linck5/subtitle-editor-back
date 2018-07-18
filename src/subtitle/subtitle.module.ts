import { Module } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { AssString2SubtitleModelService } from './assConverter.service';
import { SubtitleSchema } from './subtitle.schema';
import { LineSchema } from './line/line.schema';
import { ChangeSchema } from '../change/change.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtitleController } from './subtitle.controller';


@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Subtitle', schema: SubtitleSchema },
        { name: 'Line', schema: LineSchema },
        { name: 'Change', schema: ChangeSchema }
      ])
    ],
    providers: [SubtitleService, AssString2SubtitleModelService],
    controllers: [SubtitleController],
    exports: [SubtitleService]
})
export class SubtitleModule {

}
