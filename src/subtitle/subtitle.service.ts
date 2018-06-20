import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Subtitle } from './subtitle.schema';
import { CreateSubtitleDTO, UpdateSubtitleDTO, ListSubtitleDTO } from './subtitle.dtos';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class SubtitleService {

    constructor(
      @InjectModel('Subtitle') private readonly subtitleModel: Model<Subtitle>,
      @InjectModel('Subtitle') private readonly paginateSubtitleModel: PaginateModel<Subtitle>
    ) { }

    onModuleInit() { }

    async Create(subtitle: CreateSubtitleDTO): Promise<Subtitle> {
      const NewSubtitle = new this.subtitleModel({
        name: subtitle.name,
        description: subtitle.description,
        duration: subtitle.duration,
        url: subtitle.url
      });
      return await NewSubtitle.save();
    }

    async Update(id, subtitle: UpdateSubtitleDTO): Promise<Subtitle> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.subtitleModel.findByIdAndUpdate(id, subtitle, options);
    }

    async Delete(id): Promise<Subtitle> {
      return await this.subtitleModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Subtitle> {
      return await this.subtitleModel.findById(id);
    }


    async List(dto:ListSubtitleDTO): Promise<PaginateResult<Subtitle>> {

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

      return await this.paginateSubtitleModel.paginate(query, options);

    }

    async FindByName(subtitle_name: string): Promise<Subtitle> {
      return await this.subtitleModel.findOne({ name: subtitle_name });
    }
}
