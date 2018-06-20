import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Change } from './change.schema';
import { CreateChangeDTO, UpdateChangeDTO, ListChangeDTO } from './change.dtos';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class ChangeService {

    constructor(
      @InjectModel('Change') private readonly changeModel: Model<Change>,
      @InjectModel('Change') private readonly paginateChangeModel: PaginateModel<Change>
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

      return await this.paginateChangeModel.paginate(query, options);

    }

    async FindByName(change_name: string): Promise<Change> {
      return await this.changeModel.findOne({ name: change_name });
    }
}
