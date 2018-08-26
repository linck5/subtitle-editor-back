import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';

import { Subtitle } from './subtitle.schema';
import * as assCompiler from 'ass-compiler';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class AssConverterService {

    constructor(
      @Inject('Subtitle') private readonly subtitleModel: Model<Subtitle>
    ) { }


    AssString2Subtitle(assStr: string): Subtitle {

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
        format: "ass",
        original: assStr,
        lines: lines,
        lastId: lines.length - 1
      });

    }

    ApplySubtitleToOriginalAssString(subtitle: Subtitle): string {
      if(subtitle.format != "ass") //no
      if(!subtitle.original) //no

      return ""; //TODO
    }

}

function seconds2IntMiliss(seconds) {
  return Math.round(seconds * 1000);
}
