import { Change } from '../change.schema';

export enum AssChangeSection {
    Styles = "styles",
    Dialogues = "dialogues",
    ScriptInfo = "script_info"
}

export interface AssChange extends Change {
  data: {
    ids: number[],
    section?: AssChangeSection,
    timeShift?: number,
    fields?: [{
      name: string,
      value: any
    }]
  }
}


//TODO see if sript info is properly supported
