import { RebaseData } from '../rebase.schema';
import { IRebaseDataManager } from '../IRebaseDataManager';
import { AssConflict } from './conflict';
import { ChangeOperation } from '../../../change/change.schema';
import { AssChange, AssChangeSection } from '../../../change/ass/change';

export class AssRebaseDataManager implements IRebaseDataManager {

  private conflict: AssConflict;
  private pushChange: boolean;
  public rebaseData: RebaseData;
  public hasConflicts: boolean;

  Compose (sourceChanges:AssChange[], targetLineChanges:AssChange[]){

    this.rebaseData = [];
    this.hasConflicts = false;

    for(const sChange of sourceChanges){
      this.conflict = null;
      this.pushChange = true;

      for(const tChange of targetLineChanges){

        //creation changes don't have conflicts
        if(
          sChange.operation == ChangeOperation.Create ||
          tChange.operation == ChangeOperation.Create
        ) continue;

        const sSec = sChange.data.section;
        const tSec = tChange.data.section;

        if(
          sSec == tSec ||
          (sSec == undefined && tSec == AssChangeSection.Dialogues) ||
          (tSec == undefined && sSec == AssChangeSection.Dialogues)
          //section is undefined on TIME_SHIFT operation
        ){
          for(const sLineId of sChange.data.ids){
            for(const tLineId of tChange.data.ids){

              if(sLineId == tLineId){
                this.CheckForConflicts(sChange, tChange, sLineId);
              }
            }
          }
        }
      }



      if(this.conflict){
        this.rebaseData.push(this.conflict);
        this.hasConflicts = true;
      }
      else if(this.pushChange){
        //don't insert this as an actual Change Schema with the _id field intact
        //because then it'll throw an duplicate key error
        let change:any = sChange;
        change.change_id = sChange._id;
        change._id = undefined;

        this.rebaseData.push(change);
      }
    }
  }

  private CheckForConflicts (sChange:AssChange, tChange:AssChange, lineId:number){

    const updateCurrentConflict = (conflictingDataTypes?:ConflictingDataTypes) => {
      this.UpdateConflict(sChange, tChange, lineId, conflictingDataTypes
      );
    }

    let conflictingDataTypes = new ConflictingDataTypes();

    switch(sChange.operation + " - " + tChange.operation){

      case "DELETE - DELETE":
        if(sChange.data.ids.length > 1){
          //the target line already has a change that
          //deletes this line, so remove this id from the change
          sChange.data.ids.splice(sChange.data.ids.indexOf(lineId), 1);
        }
        else{
          //or if it was the only id, discard the whole change
          this.pushChange = false;
        }
        break;

      case "DELETE - EDIT":
      case "EDIT - DELETE":
        updateCurrentConflict();
        break;

      case "DELETE - TIME_SHIFT":
      case "TIME_SHIFT - DELETE":
        updateCurrentConflict();
        break;

      case "EDIT - EDIT":

        for(let sField of sChange.data.fields){
          for(let tField of tChange.data.fields){
            if(sField.name == tField.name){
              if(sField.value != tField.value){
                conflictingDataTypes.Add(sChange.data.section, sField.name);
              }
              else if(sChange.data.fields.length > 1){
                sChange.data.fields.splice(sChange.data.fields.indexOf(sField), 1);
              }
              else{
                this.pushChange = false;
              }
            }
          }
        }

        if(conflictingDataTypes.Get().length > 0)
          updateCurrentConflict(conflictingDataTypes);
        break;

      case "EDIT - TIME_SHIFT":
      case "TIME_SHIFT - EDIT":

        let editChange = sChange.operation == ChangeOperation.Edit? sChange: tChange;

        for(let fieldName of ["start", "end"]){

          if(
            editChange.data.fields.find(field => field.name == fieldName)
            != undefined
          ){
            conflictingDataTypes.Add(editChange.data.section, fieldName);
          }
        }

        if(conflictingDataTypes.Get().length > 0)
          updateCurrentConflict(conflictingDataTypes);
        break;

      case "TIME_SHIFT - TIME_SHIFT":
        updateCurrentConflict();
        break;
    }
  }





  private UpdateConflict (
    sChange:AssChange, tChange:AssChange,
    conflictingId:number, conflictingDataTypes?:ConflictingDataTypes
  ): void {

    if(this.conflict == null){
      this.conflict = {
        conflictingLines: [conflictingId],
        sourceChange: sChange,
        targetChanges: [tChange],
        conflictingDataTypes: conflictingDataTypes?
          conflictingDataTypes.GetForConflictAssignment()
          :
          undefined

      }
    }
    else{
      this.conflict.conflictingLines.push(conflictingId);
      if(this.conflict.targetChanges.indexOf(tChange) == -1){
        this.conflict.targetChanges.push(tChange);
      }

    }
  }

}


class ConflictingDataTypes {

  private obj = [];

  Get (){ return this.obj; }

  GetForConflictAssignment () {
    if(this.obj.length > 0) return this.obj;
    else return undefined;
  }

  Add (section:AssChangeSection, field:string){

    let existingSection =
      this.obj.find(cDataType => cDataType.section == section);

    if(existingSection){
      this.obj[this.obj.indexOf(existingSection)].fields.push(field);
    }
    else{
      this.obj.push({section: section, fields: [field]});
    }
  }

}
