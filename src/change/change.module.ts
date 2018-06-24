import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { ChangeSchema } from './change.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangeController } from './change.controller';
import { PaginationService } from '../common/pagination.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Change', schema: ChangeSchema }])
    ],
    providers: [ChangeService, PaginationService],
    controllers: [ChangeController],
    exports: [ChangeService]
})
export class ChangeModule {

}
