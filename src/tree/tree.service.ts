import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Tree } from './tree.schema';
import { Commit } from '../commit/commit.schema';
import { Node } from '../node/node.schema';
import { Video } from '../video/video.schema';
import { Change } from '../change/change.schema';
import { Rebase } from '../node/rebasing/rebase.schema';
import { Comment } from '../comment/comment.schema';
import { User } from '../user/user.schema';
import { CreateTreeDTO, UpdateTreeDTO, ListTreeDTO } from './tree.dtos';

import { PaginationService } from '../common/pagination.service';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class TreeService {

    constructor(
      @Inject('Tree') private readonly treeModel: Model<Tree>,
      @Inject('Tree') private readonly paginateTreeModel: PaginateModel<Tree>,
      @Inject('Change') private readonly changeModel: Model<Change>,
      @Inject('Commit') private readonly commitModel: Model<Commit>,
      @Inject('Node') private readonly nodeModel: Model<Node>,
      @Inject('Rebase') private readonly rebaseModel: Model<Rebase>,
      @Inject('Comment') private readonly commentModel: Model<Comment>,
      @Inject('Video') private readonly videoModel: Model<Video>,
      @Inject('User') private readonly userModel: Model<User>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }


    readonly language: string;


    async Create(tree: CreateTreeDTO): Promise<Tree> {

      //create the root node
      const NewNode = new this.nodeModel({
        collaborators: [],
        status: "ROOT",
        deleted: false,
        isInMainline: true,
        mlBaseIndex: -1
      });
      await NewNode.save();


      // create an empty commit for the root node
      const NewCommit = new this.commitModel({
        description: "root",
        node: NewNode._id
      });
      await NewCommit.save();

      // create the tree itself
      const NewTree = new this.treeModel({
        language: tree.language,
        description: tree.description,
        video_id: tree.video_id,
        subtitle_id: tree.subtitle_id,
        mainlineLength: 1
      });

      //put a reference to the tree in the video
      let TreeVideo:Video = await this.videoModel.findById(NewTree.video_id);
      TreeVideo.tree_ids.push(NewTree._id);
      TreeVideo.save();

      await NewTree.save();

      return NewTree;

    }

    async Update(id, tree: UpdateTreeDTO): Promise<Tree> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.treeModel.findByIdAndUpdate(id, tree, options);
    }

    async Delete(id): Promise<Tree> {
      //TODO also clean up all related data

      return await this.treeModel.findByIdAndRemove(id);
    }

    async Drop(): Promise<any> {

      //have to check if each collection exists otherwise mongo will throw an error

      console.log("wipping all trees and related data...")

      if(await this.commentModel.count({}) != 0){
        await this.commentModel.collection.drop();
      }
      if(await this.changeModel.count({}) != 0){
        await this.changeModel.collection.drop();
      }
      if(await this.commitModel.count({}) != 0){
        await this.commitModel.collection.drop();
      }
      if(await this.rebaseModel.count({}) != 0){
        await this.rebaseModel.collection.drop();
      }
      if(await this.nodeModel.count({}) != 0){
        await this.userModel.updateMany({},  { node_ids: [] });
        await this.nodeModel.collection.drop();
      }
      if(await this.treeModel.count({}) != 0){
        await this.videoModel.updateMany({}, { tree_ids: [] });
        return await this.treeModel.collection.drop();
      }
      else return null;

    }

    async GetById(id): Promise<Tree> {
      return await this.treeModel.findById(id);
    }


    async List(dto:ListTreeDTO): Promise<PaginateResult<Tree>> {

      let query:any = {};

      const options = this.paginationService.PaginateOptionsFromDto(dto);
      if(dto.ids) query['_id'] = { $in : dto.ids}

      return await this.paginateTreeModel.paginate(query, options);

    }

    async FindByName(tree_name: string): Promise<Tree> {
      return await this.treeModel.findOne({ name: tree_name });
    }
}
