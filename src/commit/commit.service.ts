import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Commit } from './commit.schema';
import { CreateCommitDTO, UpdateCommitDTO, ListCommitDTO } from './commit.dtos';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class CommitService {

    constructor(
      @InjectModel('Commit') private readonly commitModel: Model<Commit>,
      @InjectModel('Commit') private readonly paginateCommitModel: PaginateModel<Commit>
    ) { }

    onModuleInit() { }

    async Create(commit: CreateCommitDTO): Promise<Commit> {
      const NewCommit = new this.commitModel({
        name: commit.name,
        description: commit.description,
        duration: commit.duration,
        url: commit.url
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

    async Delete(id): Promise<Commit> {
      return await this.commitModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Commit> {
      return await this.commitModel.findById(id);
    }


    async List(dto:ListCommitDTO): Promise<PaginateResult<Commit>> {

      let query:any = {};

      let options:PaginateOptions = {
        sort: {}
      };

      //the pagination library won't work assigning undefined to
      //PaginateOptions feilds, so conditionally assign them:
      if(dto.limit) options.limit = dto.limit;
      if(dto.offset) options.offset = dto.offset;
      if(dto.page) options.page = dto.page;
      if(dto.orderby && dto.orderby.length > 0){
        dto.orderby.map(orderByParam => {
          options.sort[orderByParam.field] = orderByParam.desc? -1:1
        });
      };

      return await this.paginateCommitModel.paginate(query, options);

    }

    async FindByName(commit_name: string): Promise<Commit> {
      return await this.commitModel.findOne({ name: commit_name });
    }
}
