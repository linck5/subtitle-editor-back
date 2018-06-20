import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { ChangeSchema } from './change.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangeController } from './change.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Change', schema: ChangeSchema }])
    ],
    providers: [ChangeService],
    controllers: [ChangeController],
    exports: [ChangeService]
})
export class ChangeModule {

}
