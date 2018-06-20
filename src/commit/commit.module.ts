import { Module } from '@nestjs/common';
import { CommitService } from './commit.service';
import { CommitSchema } from './commit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitController } from './commit.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Commit', schema: CommitSchema }])
    ],
    providers: [CommitService],
    controllers: [CommitController],
    exports: [CommitService]
})
export class CommitModule {

}
