import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions, Schema } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Node } from './node.schema';
import { Tree } from '../tree/tree.schema';
import { User } from '../user/user.schema';
import { Commit } from '../commit/commit.schema';
import { Change } from '../change/change.schema';
import { Rebase } from './rebasing/rebase.schema';
import { RebaseService } from './rebasing/rebase.service';
import { Collaborator } from './collaborator/collaborator.schema';
import { CreateNodeDTO, UpdateNodeDTO, ListNodeDTO } from './node.dtos';

import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class NodeService {

    constructor(
      @Inject('Node') private readonly nodeModel: Model<Node>,
      @Inject('Node') private readonly paginateNodeModel: PaginateModel<Node>,
      @Inject('Tree') private readonly treeModel: Model<Tree>,
      @Inject('Commit') private readonly commitModel: Model<Commit>,
      @Inject('Change') private readonly changeModel: Model<Change>,
      @Inject('User') private readonly userModel: Model<User>,
      @Inject('Collaborator') private readonly collaboratorModel: Model<Collaborator>,
      private readonly paginationService: PaginationService,
      private readonly rebaseService: RebaseService
    ) { }


    async Create(dto:CreateNodeDTO): Promise<Node> {


      const Tree:Tree = await this.treeModel.findById(dto.tree_id);
      const Creator:User = await this.userModel.findById(dto.creator_id);

      // create the collaborator document for the creator
      const CreatorAsCollaborator = new this.collaboratorModel({
        user_id: Creator._id,
        creator: true,
        admin: true
      });


      // any new node is created on top of the mainline,
      // so the base mainline index is the last index of the mainline
      // in the current state of this node's creation
      const mainlineBaseIndex:number = Tree.mainlineLength - 1;

      // create the node itself
      const NewNode = new this.nodeModel({
        collaborators: [CreatorAsCollaborator],
        status: "UNMODIFIED",
        deleted: false,
        tree_id: dto.tree_id,
        mlBaseIndex: mainlineBaseIndex
      });

      // put a reference to the node in the user
      Creator.node_ids.push(NewNode._id);
      await Creator.save();

      await NewNode.save();

      return NewNode;
    }

    async CreateRebasedNode(tree:Tree, rebase:Rebase): Promise<Node>{

      const mainlineBaseIndex:number = tree.mainlineLength - 1;

      // create the node itself
      const rebasedNode = new this.nodeModel({
        status: "REBASED",
        deleted: false,
        tree_id: tree._id,
        mlBaseIndex: mainlineBaseIndex,
        isInMainline: true,
        source_id: rebase.sourceNode._id
      });
      await rebasedNode.save();

      const rebasedCommit = new this.commitModel({
        description: "rebase",
        done: true,
        node_id: rebasedNode._id
      });
      await rebasedCommit.save();

      let rebasedChanges:Change[] = [];
      for(const change of rebase.rebaseData){
        const rebasedChange = new this.changeModel(change);
        rebasedChange.node_id = rebasedNode._id;
        rebasedChange.commit_id = rebasedCommit._id;
        rebasedChanges.push(rebasedChange);
      }

      await this.changeModel.insertMany(rebasedChanges);


      //this node is being added to the mainline so its necessary
      //to update the mainline length on the tree doc
      tree.mainlineLength++;
      await tree.save();

      return rebasedNode;


    }



    async Update(id, updateDto: UpdateNodeDTO): Promise<Node | ApproveResponse> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }

      const node:Node = await this.nodeModel.findById(id);

      if(updateDto.status == "APPROVED"){

        if(updateDto.resolvedRebase){

          const resolvedRebase:Rebase = await this.rebaseService.Apply(updateDto.resolvedRebase);

          return await this.Approve(node, resolvedRebase);
        }
        else{
          return await this.Approve(node);
        }

      }
      else{

        //TODO update the node without finding by id again
        let res =  await this.nodeModel.findByIdAndUpdate(node._id, updateDto, options);
        return res;
      }



    }

    async Approve(node:Node, resolvedRebase?:Rebase): Promise<ApproveResponse>{

      let tree:Tree = await this.treeModel.findById(node.tree_id);

      const pendingRebase:Rebase =
        await this.rebaseService.CheckForAPendingRebase(tree);

      if(pendingRebase){
        if(pendingRebase._id == resolvedRebase._id){
          const rebasedNode:Node = await this.CreateRebasedNode(tree, resolvedRebase);

          node.status = "APPROVED";
          await node.save();

          return {
            responseCode: 5,
            message: "Approved successfuly and rebased with given rebase data",
            approvedNode: node,
            rebasedNode: rebasedNode,
            rebase: resolvedRebase
          }
        }
        else{
          return {
            responseCode: 4,
            message: "Not approved, there is a pending rebase",
            pendingRebase: pendingRebase
          }
        }
      }
      //check if the node is based on the mainline leaf node
      if(node.mlBaseIndex == tree.mainlineLength - 1){
        node.status = "APPROVED";
        node.isInMainline = true;
        await node.save();
        tree.mainlineLength++;
        await tree.save();

        return {
          responseCode: 1,
          message: "Approved successfuly",
          approvedNode: node
        }

      }
      //if not, a rebase is required
      else{
        let rebase:Rebase = await this.rebaseService.Create(tree, node);

        if(rebase.conflictsStatus == "PENDING"){
          return {
            responseCode: 3,
            message: "Not approved, solving rebase conflicts is required",
            rebase: rebase
          }
        }
        else{
          const rebasedNode = await this.CreateRebasedNode(tree, rebase);

          rebase.fulfilled = true;
          await rebase.save();

          node.status = "APPROVED";
          await node.save();

          return {
            responseCode: 2,
            message: "Approved successfuly and rebased",
            approvedNode: node,
            rebasedNode: rebasedNode,
            rebase: rebase
          }
        }


      }
    }

    async Delete(id): Promise<Node> {
      return await this.nodeModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Node> {
      return await this.nodeModel.findById(id);
    }


    async List(dto:ListNodeDTO): Promise<PaginateResult<Node>> {

      let query:any = {};
      if(dto.isInMainline != undefined) query.isInMainline = dto.isInMainline;

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateNodeModel.paginate(query, options);

    }

}

interface ApproveResponse {

  //response codes:
  //1 - approved successfuly
  //2 - approved successfuly and rebased
  //3 - not approved, solving rebase conflicts is required
  //4 - not approved, there is a pending rebase
  //5 - approved successfuly and rebased with given rebase data
  responseCode: 1 | 2 | 3 | 4 | 5;
  message: string;
  approvedNode?: Node;
  rebasedNode?: Node;
  rebase?: Rebase;
  pendingRebase?: Rebase;
}
