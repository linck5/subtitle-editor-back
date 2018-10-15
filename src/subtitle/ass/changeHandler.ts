import { Subtitle } from '../subtitle.schema';
import { AssSubtitle, AssData, AssStyle, AssDialogue, AssScriptInfo } from '../ass/format';
import { AssChange, AssChangeSection } from '../../change/ass/change';

export class AssChangeHandler {

  defaultStyleFields = [
      //{ name: "id", value: "number" },
      { name: "name", value: "string" },
      { name: "fontname", value: "Arial" },
      { name: "fontsize", value: 20 },
      { name: "primaryColour", value: "&H00FFFFFF" },
      { name: "secondaryColour", value: "&H000000FF" },
      { name: "outlineColour", value: "&H00000000" },
      { name: "backColour", value: "&H00000000" },
      { name: "bold", value: false },
      { name: "italic", value: false },
      { name: "underline", value: false },
      { name: "strikeOut", value: false },
      { name: "scaleX", value: 100 },
      { name: "scaleY", value: 100 },
      { name: "spacing", value: 0 },
      { name: "angle", value: 0 },
      { name: "borderStyle", value: 1 },
      { name: "outline", value: 2 },
      { name: "shadow", value: 2 },
      { name: "alignment", value: 2 },
      { name: "marginL", value: 10 },
      { name: "marginR", value: 10 },
      { name: "marginV", value: 10 },
      { name: "encoding", value: 0 },
]

  defaultDialogueFields = [
      //{ name: "id", value: "number" },
      { name: "layer", value: 0 },
      { name: "start", value: "0:00:00.00" },
      { name: "end", value: "0:00:00.00" },
      { name: "style", value: "Default" },
      { name: "name", value: "" },
      { name: "marginL", value:  0 },
      { name: "marginR", value: 0 },
      { name: "marginV", value: 0 },
      { name: "effect", value: "" },
      { name: "text", value: "" },
]

  async ApplyChanges(sub:AssSubtitle, changes:AssChange[]): Promise<AssSubtitle> {


    //TODO validate params

    for (const change of changes){

      if(!change.data) continue; //TODO this should be handled by vaidation instead

      let sectionName;

      //if section is undefined, it's because it's TIME_SHIFT, so it's dialogues
      if(!change.data.section) change.data.section = AssChangeSection.Dialogues;

      if(change.data.section){
        sectionName = new SectionNameFormatHelper(change.data.section);
      }

      if(change.operation == "CREATE"){

        let sectionItem:any = {};
        let defaultFields = this['default'+sectionName.FUS+'Fields'];

        for(let defaultField of defaultFields){
          sectionItem[defaultField.name] = defaultField.value;
        }

        //change fields override the previously set default ones
        for(let changeField of change.data.fields){
          sectionItem[changeField.name] = changeField.value;
        }

        sectionItem.id = sub.data['last'+sectionName.FUS+'Id'] + 1;
        sub.data[sectionName.LP].push(sectionItem);
        sub.data['last'+sectionName.FUS+'Id']++;
      }
      else {
        const targetSectionItems:Array<AssDialogue | AssStyle> =
          sub.data[sectionName.LP].filter(
            sectionItem => change.data.ids.some(id => id == sectionItem.id)
          );

        for (const tSectionItem of targetSectionItems){

          const subItemIndex = sub.data[sectionName.LP].indexOf(tSectionItem);

          if(subItemIndex == -1) continue;

          let subItem = sub.data[sectionName.LP][subItemIndex];

          switch(change.operation){
            case "DELETE":
                sub.data[sectionName.LP].splice(subItemIndex, 1);
              break;
            case "EDIT":

              for(const changeField of change.data.fields){
                if(subItem[changeField.name] != undefined){
                  subItem[changeField.name] = changeField.value;
                }
              }
              break;
            case "TIME_SHIFT":
              subItem.start += change.data.timeShift;
              subItem.end += change.data.timeShift;
              break;
          }
        }
      }
    }
    return sub;
  }


}

class SectionNameFormatHelper {

  LP:string; //LowerCase Plural
  LS:string; //LowerCase Singular
  FUP:string; //First-letter-UpperCase Plural
  FUS:string; //First-letter-UpperCase Singular

  constructor(sectionNameLowerCasePlural:string) {
    this.LP = sectionNameLowerCasePlural;
    this.LS =  this.LP.substring(0, this.LP.length - 1);
    this.FUP = this.LP.replace(/^\w/, c => c.toUpperCase());
    this.FUS = this.LS.replace(/^\w/, c => c.toUpperCase());
  }
}
