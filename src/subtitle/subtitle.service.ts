import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateSubtitleDTO } from './subtitle.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Subtitle } from './subtitle.schema';
import { Line } from './line/line.schema';
import { Change } from '../change/change.schema';
import { AssString2SubtitleModelService } from './assConverter.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class SubtitleService {

    constructor(
      @InjectModel('Subtitle') private readonly subtitleModel: Model<Subtitle>,
      @InjectModel('Line') private readonly lineModel: Model<Line>,
      @InjectModel('Change') private readonly changeModel: Model<Change>,
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

    async ApplyChanges(subId, changes:Change[]): Promise<Subtitle> {

      let sub:Subtitle = await this.subtitleModel.findById(subId);

      for (const change of changes){

        if(change.type == "CREATE"){

          let isMissingProp = false;
          for(const prop of ["startTime", "endTime", "text"]){
            if(change.data[prop] == undefined)
              isMissingProp = true;
          }
          if(isMissingProp) continue;

          sub.lines.push(
            new this.lineModel({
              id: ++sub.lastId,
              startTime: change.data.startTime,
              endTime: change.data.endTime,
              text: change.data.text
            })
          )
        }
        else {

          const targetLines:Line[] = sub.lines.filter(line =>
            change.line_ids.some(id => id == line.id));

          for (const targetLine of targetLines){

            const subLineIndex = sub.lines.indexOf(targetLine)

            if(!subLineIndex) continue;

            let subLine = sub.lines[subLineIndex];

            switch(change.type){
              case "DELETE":
                sub.lines.splice(sub.lines.indexOf(targetLine), 1);
                break;
              case "EDIT":
                for(const prop of ["startTime", "endTime", "text"]){
                  if(change.data[prop] !== undefined)
                    subLine[prop] = change.data[prop];
                }
                break;
              case "TIME_SHIFT":
                subLine.startTime += change.data.timeShift;
                subLine.endTime += change.data.timeShift;
                break;
            }
          }
        }
      }

      return sub;
    }

}
