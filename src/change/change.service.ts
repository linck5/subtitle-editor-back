import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Change } from './change.schema';
import { CreateChangeDTO, ListChangeDTO } from './change.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class ChangeService {

    constructor(
      @InjectModel('Change') private readonly changeModel: Model<Change>,
      @InjectModel('Change') private readonly paginateChangeModel: PaginateModel<Change>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(change: CreateChangeDTO): Promise<Change> {
      const NewChange = new this.changeModel({
        lineIds: change.lineIds,
        user: change.user,
        commit: change.commit,
        type: change.type,
        data: change.data
      });
      return await NewChange.save();
    }

    async Delete(id): Promise<Change> {
      return await this.changeModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Change> {
      return await this.changeModel.findById(id);
    }
    async List(dto:ListChangeDTO): Promise<PaginateResult<Change>> {

      let query:any = {};

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateChangeModel.paginate(query, options);

    }
}
