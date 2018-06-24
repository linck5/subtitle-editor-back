import { Module } from '@nestjs/common';
import { TreeService } from './tree.service';
import { TreeSchema } from './tree.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TreeController } from './tree.controller';
import { PaginationService } from '../common/pagination.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Tree', schema: TreeSchema }])
    ],
    providers: [TreeService, PaginationService],
    controllers: [TreeController],
    exports: [TreeService]
})
export class TreeModule {

}
