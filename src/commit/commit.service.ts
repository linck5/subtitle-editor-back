import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Commit } from './commit.schema';
import { CreateCommitDTO, UpdateCommitDTO, ListCommitDTO } from './commit.dtos';

import { PaginationService } from '../common/pagination.service';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class CommitService {

    constructor(
      @Inject('Commit') private readonly commitModel: Model<Commit>,
      @Inject('Commit') private readonly paginateCommitModel: PaginateModel<Commit>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(commit: CreateCommitDTO): Promise<Commit> {
      const NewCommit = new this.commitModel({
        description: commit.description,
        node_id: commit.node_id
      });
      return await NewCommit.save();
    }

    async Update(id, commit: UpdateCommitDTO): Promise<Commit> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.commitModel.findByIdAndUpdate(id, commit, options);
    }


    async GetById(id): Promise<Commit> {
      return await this.commitModel.findById(id);
    }


    async List(dto:ListCommitDTO): Promise<PaginateResult<Commit>> {

      let query:any = {};
      if(dto.done != undefined) query.done = dto.done;

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateCommitModel.paginate(query, options);

    }

}
