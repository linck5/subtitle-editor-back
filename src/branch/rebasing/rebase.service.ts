import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Rebase, RebaseData, Conflict } from './rebase.schema';
import { ResolvedRebaseDTO } from './rebase.dtos';
import { Branch } from '../branch.schema';
import { Tree } from '../../tree/tree.schema';
import { Model, Schema } from 'mongoose';
import { Change } from '../../change/change.schema';
import { RebasedChangeDTO } from '../../change/change.dtos'


@Injectable()
export class RebaseService {

  conflict: Conflict;
  pushChange: boolean;

  constructor(
    @Inject('Rebase') private readonly rebaseModel: Model<Rebase>,
    @Inject('Tree') private readonly treeModel: Model<Tree>,
    @Inject('Branch') private readonly branchModel: Model<Branch>,
    @Inject('Change') private readonly changeModel: Model<Change>
  ) { }

  async Apply(resolvedRebaseDto:ResolvedRebaseDTO, tree?:Tree, rebase?:Rebase): Promise<Rebase> {

    if(!rebase) rebase = await this.rebaseModel.findById(resolvedRebaseDto.rebaseId);
    if(!tree) tree = await this.treeModel.findById(rebase.tree_id)

    let resolvedChanges:Change[] = []

    for(let rebaseDataElement of resolvedRebaseDto.rebaseData){

      //all the resolved changes must be from the source branch
      if(rebaseDataElement.branch_id != rebase.sourceBranch._id){
        throw new HttpException({
          error: "The resolved changes must all point to the branch of id: "
           + rebase.sourceBranch._id
        }, HttpStatus.BAD_REQUEST);
      }
      else{
        resolvedChanges.push(new this.changeModel(rebaseDataElement));
      }
    }

    rebase.rebaseData = resolvedChanges;
    rebase.conflictsStatus = "RESOLVED";
    await rebase.save();
    return rebase;
  }

  async Create(tree:Tree, sourceBranch:Branch): Promise<Rebase> {

    const targetLineIds:Schema.Types.ObjectId[] =
      (await this.branchModel.find({
        tree_id: tree._id,
        mlBaseIndex: {$gt: sourceBranch.mlBaseIndex},
        isInMainline: true
      }))
      .map(doc => doc._id);

    const targetLineChanges:Change[] =
      await this.changeModel.find({branch_id: {$in: targetLineIds}});

    const sourceChanges:Change[] =
      await this.changeModel.find({branch_id: sourceBranch._id})

    let rebaseData:RebaseData = [];

    let hasConflicts:boolean = false;

    for(const sChange of sourceChanges){

      this.conflict = null;
      this.pushChange = true;

      for(const tChange of targetLineChanges){

        for(const sLineId of sChange.line_ids){
          for(const tLineId of tChange.line_ids){

            if(sLineId == tLineId){
              this.CheckForConflicts(sChange, tChange, sLineId);
            }
          }
        }
      }

      if(this.conflict){
        rebaseData.push(this.conflict);
        hasConflicts = true;
      }
      else if(this.pushChange){
        //don't insert this as an actual Change Schema with the _id field intact
        //because then it'll throw an duplicate key error
        let change:any = sChange;
        change.change_id = sChange._id;
        change._id = undefined;

        rebaseData.push(sChange);
      }
    }

    const NewRebase = new this.rebaseModel({
      tree_id: tree._id,
      sourceBranch: sourceBranch,
      targetLineBranch_ids: targetLineIds,
      rebaseData: rebaseData,
      conflictsStatus: hasConflicts? "PENDING" : "NO_CONFLICTS",
      fulfilled: false
    });

    return await NewRebase.save();
  }

  CheckForConflicts(sChange:Change , tChange:Change, lineId:number){

    const updateCurrentConflict = (conflictingDataTypes?) => {
      this.UpdateConflict(sChange, tChange, lineId, conflictingDataTypes
      );
    }
    let conflictingDataTypes;

    switch(sChange.type + " - " + tChange.type){

      case "DELETE - DELETE":
        if(sChange.line_ids.length > 1){
          //the target line already has a change that
          //deletes this line, so remove this id from the change
          sChange.line_ids.splice(sChange.line_ids.indexOf(lineId), 1);
        }
        else{
          //or if it was the only id, discard the whole change
          this.pushChange = false;
        }
        break;

      case "DELETE - EDIT":
        updateCurrentConflict();
        break;

      case "DELETE - TIME_SHIFT":
        updateCurrentConflict();
        break;

      case "EDIT - EDIT":
        conflictingDataTypes = [];

        let sChangeDataFields = Object.keys(sChange.toObject().data);

        sChangeDataFields.forEach(key => {
          if(
          sChange.data[key] != undefined &&
          tChange.data[key] != undefined){

            if(sChange.data[key] != tChange.data[key]){
              conflictingDataTypes.push(key);
            }
            //if the two edits edit one or more data fields in exactly
            //the same way, there is no need for a conflict, just delete
            //that data field from the source change edit, or if it was the only
            //data field, discard the whole change
            else if(sChangeDataFields.length > 1){
              sChange.data[key] = undefined;
            }
            else{
              this.pushChange = false;
            }


          }
        })
        if(conflictingDataTypes.length > 0)
          updateCurrentConflict(conflictingDataTypes);
        break;

      case "EDIT - TIME_SHIFT":
        conflictingDataTypes = [];

        if(sChange.data.startTime != undefined)
          conflictingDataTypes.push("startTime");

        if(sChange.data.endTime != undefined)
          conflictingDataTypes.push("endTime");

        if(conflictingDataTypes.length > 0)
          updateCurrentConflict(conflictingDataTypes);
        break;

      case "TIME_SHIFT - TIME_SHIFT":
        updateCurrentConflict();
        break;
    }
  }

  //returna the pending rebase or null if there is none in the tree
  async CheckForAPendingRebase(tree:Tree): Promise<Rebase> {
    return await this.rebaseModel.findOne({tree_id: tree._id, fulfilled: false});
  }

  UpdateConflict(
    sChange:Change, tChange:Change,
    conflictingId:number, conflictingDataTypes?:Array<any>
  ): void {
    if(this.conflict == null){
      this.conflict = {
        conflictingLines: [conflictingId],
        sourceChange: sChange,
        targetChange: tChange,
        conflictingDataTypes: conflictingDataTypes
      }
    }
    else{
      this.conflict.conflictingLines.push(conflictingId);
    }
  }

}
