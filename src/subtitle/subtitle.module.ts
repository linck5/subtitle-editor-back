import { Module } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { AssConverterService } from './assConverter.service';
import { SubtitleSchema } from './subtitle.schema';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';
import { LineSchema } from './line/line.schema';
import { SubtitleController } from './subtitle.controller';


@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(SubtitleSchema, "Subtitle"),
      getCollectionProvider(LineSchema, "Line"),
      SubtitleService,
      AssConverterService
    ],
    controllers: [SubtitleController],
    exports: [SubtitleService]
})
export class SubtitleModule {

}
