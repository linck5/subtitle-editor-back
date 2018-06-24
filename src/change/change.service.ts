import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Change } from './change.schema';
import { CreateChangeDTO, UpdateChangeDTO, ListChangeDTO } from './change.dtos';
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
        name: change.name,
        description: change.description,
        duration: change.duration,
        url: change.url
      });
      return await NewChange.save();
    }

    async Update(id, change: UpdateChangeDTO): Promise<Change> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.changeModel.findByIdAndUpdate(id, change, options);
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

    async FindByName(change_name: string): Promise<Change> {
      return await this.changeModel.findOne({ name: change_name });
    }
}
