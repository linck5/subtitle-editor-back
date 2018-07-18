import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subtitle } from './subtitle.schema';
import * as assCompiler from 'ass-compiler';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class AssString2SubtitleModelService {

    constructor(
      @InjectModel('Subtitle') private readonly subtitleModel: Model<Subtitle>
    ) { }


    Convert(assStr: string): Subtitle {

      let compiled = assCompiler.compile(assStr);
      let lines = [];
      let id = 0;

      compiled.dialogues.map(dialogue => {
        lines.push({
          id: id++,
          text: dialogue.slices[0].fragments[0].text,
          startTime: seconds2IntMiliss(dialogue.start),
          endTime: seconds2IntMiliss(dialogue.end)
        })
      });

      return new this.subtitleModel({
        lines: lines,
        lastId: lines.length - 1
      });

    }

}

function seconds2IntMiliss(seconds) {
  return Math.round(seconds * 1000);
}
