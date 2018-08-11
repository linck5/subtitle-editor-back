import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Change } from './change.schema';
import { CreateChangeDTO, ListChangeDTO } from './change.dtos';

import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class ChangeService {

    constructor(
      @Inject('Change') private readonly changeModel: Model<Change>,
      @Inject('Change') private readonly paginateChangeModel: PaginateModel<Change>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(change: CreateChangeDTO): Promise<Change> {

      //TODO should I verify here if the user is actually a collaborator and is authorized to make this change?

      const NewChange = new this.changeModel({
        line_ids: change.line_ids,
        user_id: change.user_id,
        branch_id: change.branch_id,
        commit_id: change.commit_id,
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
