import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Rebase, RebaseData } from './rebase.schema';
import { ResolvedRebaseDTO } from './rebase.dtos';
import { Node } from '../node.schema';
import { Tree } from '../../tree/tree.schema';
import { Model, Schema } from 'mongoose';
import { Change } from '../../change/change.schema';
import { Subtitle, SubtitleFormats } from '../../subtitle/subtitle.schema';
import { AssRebaseDataManager } from './ass/rebaseDataManager';
import { IRebaseDataManager } from './IRebaseDataManager';


@Injectable()
export class RebaseService {



  constructor(
    @Inject('Subtitle') private readonly subtitleModel: Model<Subtitle>,
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
      await this.changeModel.find({node_id: sourceNode._id});

    const subtitleFormat =
      (await this.subtitleModel.findById(tree.subtitle_id)).format;

    let rebaseDataManager:IRebaseDataManager;

    switch(subtitleFormat){
      case SubtitleFormats.ASS:
        rebaseDataManager = new AssRebaseDataManager();
    }

    rebaseDataManager.Compose(sourceChanges, targetLineChanges);

    const NewRebase = new this.rebaseModel({
      tree_id: tree._id,
      sourceNode: sourceNode,
      targetLineNode_ids: targetLineIds,
      rebaseData: rebaseDataManager.rebaseData,
      conflictsStatus: rebaseDataManager.hasConflicts? "PENDING" : "NO_CONFLICTS",
      fulfilled: false
    });

    return await NewRebase.save();
  }



  //returna the pending rebase or null if there is none in the tree
  async CheckForAPendingRebase(tree:Tree): Promise<Rebase> {
    return await this.rebaseModel.findOne({tree_id: tree._id, fulfilled: false});
  }



}
