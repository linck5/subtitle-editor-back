import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Subtitle, SubtitleFormats } from './subtitle.schema';
import { Change } from '../change/change.schema';
import { AssConverterService } from './assConverter.service';
import { AssChangeHandler } from './ass/changeHandler';
import { AssSubtitle } from './ass/format';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class SubtitleService {

    constructor(
      @Inject('Subtitle') private readonly subtitleModel: Model<Subtitle>,
      private readonly assConverterService: AssConverterService
    ) { }

    async CreateFromASSFile(assFile: any): Promise<Subtitle> {

      return await this.assConverterService.AssString2Subtitle(assFile).save();
    }


    async Delete(id): Promise<Subtitle> {
      return await this.subtitleModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Subtitle> {
      return await this.subtitleModel.findById(id);
    }

    async ApplyChanges(subId, changes:Change[]): Promise<Subtitle> {

      let sub:Subtitle = await this.subtitleModel.findById(subId);

      if(sub.format == SubtitleFormats.ASS){
        const handler:AssChangeHandler = new AssChangeHandler();
        return handler.ApplyChanges(<AssSubtitle>sub, changes);
      }
      else{
        //TODO http error
      }


    }

}
