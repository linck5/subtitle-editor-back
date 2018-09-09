import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Rebase, RebaseData, Conflict } from './rebase.schema';
import { ResolvedRebaseDTO } from './rebase.dtos';
import { Node } from '../node.schema';
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
    @Inject('Node') private readonly nodeModel: Model<Node>,
    @Inject('Change') private readonly changeModel: Model<Change>
  ) { }

  async Apply(resolvedRebaseDto:ResolvedRebaseDTO, tree?:Tree, rebase?:Rebase): Promise<Rebase> {

    if(!rebase) rebase = await this.rebaseModel.findById(resolvedRebaseDto.rebaseId);
    if(!tree) tree = await this.treeModel.findById(rebase.tree_id)

    let resolvedChanges:Change[] = [];

    for(let rebaseDataElement of resolvedRebaseDto.rebaseData){

      //all the resolved changes must be from the source node
      if(rebaseDataElement.node_id != rebase.sourceNode._id){
        throw new HttpException({
          error: "The resolved changes must all point to the node of id: "
           + rebase.sourceNode._id
        }, HttpStatus.BAD_REQUEST);
      }
      else{
        resolvedChanges.push(new this.changeModel(rebaseDataElement));
      }
    }

    rebase.rebaseData = [];
    //push keys with change_id field instead of _id
    //to avoid duplicate keys
    for(let resolvedChange of resolvedChanges){
      let change:any = resolvedChange;
      change.change_id = resolvedChange._id;
      change._id = undefined;
      rebase.rebaseData.push(change);
    }

    rebase.conflictsStatus = "RESOLVED";
    await rebase.save();
    return rebase;
  }

  async Create(tree:Tree, sourceNode:Node): Promise<Rebase> {

    const targetLineIds:Schema.Types.ObjectId[] =
      (await this.nodeModel.find({
        tree_id: tree._id,
        mlBaseIndex: {$gte: sourceNode.mlBaseIndex},
        isInMainline: true
      }))
      .map(doc => doc._id);

    const targetLineChanges:Change[] =
      await this.changeModel.find({node_id: {$in: targetLineIds}});

    const sourceChanges:Change[] =
      await this.changeModel.find({node_id: sourceNode._id})

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
      sourceNode: sourceNode,
      targetLineNode_ids: targetLineIds,
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
      case "EDIT - DELETE":
        updateCurrentConflict();
        break;

      case "DELETE - TIME_SHIFT":
      case "TIME_SHIFT - DELETE":
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
      case "TIME_SHIFT - EDIT":
        conflictingDataTypes = [];

        for(let change of [sChange, tChange]){
          if(change.data.startTime != undefined)
            conflictingDataTypes.push("startTime");

          if(change.data.endTime != undefined)
            conflictingDataTypes.push("endTime");
        }


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
        targetChanges: [tChange],
        conflictingDataTypes: conflictingDataTypes
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
