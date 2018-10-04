import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';

import { Subtitle } from './subtitle.schema';
import { AssSubtitle, AssData, AssStyle, AssDialogue, AssScriptInfo } from './ass/format';
import * as assCompiler from 'ass-compiler';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class AssConverterService {

    constructor(
      @Inject('Subtitle') private readonly subtitleModel: Model<Subtitle>
    ) { }

    private String2Primitive(str: string): string | number | boolean {

      if(!isNaN(str as any)){
        return parseFloat(str);
      }
      else if(str.toLowerCase() == "true" || str.toLowerCase() == "yes"){
        return true;
      }
      else if(str.toLowerCase() == "false" || str.toLowerCase() == "no"){
        return false;
      }
      else{
        return str;
      }
    }

    private Seconds2Milli(seconds:number): number {
      return seconds * 1000;
    }

    AssString2Subtitle(assStr: string): Subtitle {

      let parsed = assCompiler.parse(assStr);

      let dialogues:AssDialogue[] = [];
      let lastDialogueId = 0;
      let styles:AssStyle[] = [];
      let lastStyleId = 0;

      let scriptInfo:AssScriptInfo[] = []
      let assData:AssData;

      if(parsed.info){
        for(let [prop, value] of Object.entries(parsed.info)){
          scriptInfo.push({
            prop: prop,
            value: this.String2Primitive(value as string)
          });
        }
      }

      if(parsed.styles && parsed.styles.style){
        parsed.styles.style.map(style => {

          let styleObj:any = {};

          let stylePropNames = ["name","fontname","fontsize","primaryColour",
          "secondaryColour","outlineColour","backColour","bold",
          "italic","underline","strikeOut","scaleX","scaleY",
          "spacing","angle","borderStyle","outline","shadow","alignment",
          "marginL","marginR","marginV","encoding"]

          styleObj.id = lastStyleId++;

          for (let i = 0; i < style.length; i++) {
            styleObj[stylePropNames[i]] = this.String2Primitive(style[i]);
          }

          styles.push(styleObj);
        });
      }


      if(parsed.events && parsed.events.dialogue){
        parsed.events.dialogue.map(dialogue => {
          dialogues.push({
            id: lastDialogueId++,
            layer: dialogue.Layer,
            start: this.Seconds2Milli(dialogue.Start),
            end: this.Seconds2Milli(dialogue.End),
            style: dialogue.Style,
            name: dialogue.Name,
            marginL: dialogue.MarginL,
            marginR: dialogue.MarginR,
            marginV: dialogue.MarginV,
            effect: dialogue.Effect,
            text: dialogue.Text.raw,
          })
        });
      }

      assData = {
        scriptInfo: scriptInfo,
        dialogues: dialogues,
        lastDialogueId: --lastDialogueId,
        styles: styles,
        lastStyleId: --lastStyleId
      };

      return new this.subtitleModel({
        format: "ASS",
        original: assStr,
        data: assData
      });
    }

    ApplySubtitleToOriginalAssString(subtitle: Subtitle): string {
      if(subtitle.format != "ass") return; //TODO
      if(!subtitle.original) return;//TODO

      const lines = subtitle.original.split(/\r?\n/);

      for(let line of lines){
        line.trim();
        if (/^;/.test(line)) continue;

        if(/^Dialogue\s*:/i.test(line)){

        }
      }

      return ""; //TODO
    }

}
