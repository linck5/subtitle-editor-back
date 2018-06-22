import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateSubtitleDTO } from './subtitle.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Subtitle } from './subtitle.schema';
import { AssString2SubtitleModelService } from './assConverter.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class SubtitleService {

    constructor(
      @InjectModel('Subtitle') private readonly subtitleModel: Model<Subtitle>,
      private readonly assString2SubtitleModel: AssString2SubtitleModelService
    ) { }

    async Create(subtitle: CreateSubtitleDTO): Promise<Subtitle> {
      const NewSubtitle = new this.subtitleModel({
        lines: subtitle.lines,
      });
      return await NewSubtitle.save();
    }

    async CreateFromASSFile(assFile: any): Promise<Subtitle> {

      return await this.assString2SubtitleModel.Convert(assFile).save();
    }


    async Delete(id): Promise<Subtitle> {
      return await this.subtitleModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Subtitle> {
      return await this.subtitleModel.findById(id);
    }

}
