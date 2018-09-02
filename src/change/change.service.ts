import { Model, PaginateModel, PaginateResult, Schema } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Change } from './change.schema';
import { Tree } from '../tree/tree.schema';
import { Node } from '../node/node.schema';
import { CreateChangeDTO, ListChangeDTO } from './change.dtos';

import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class ChangeService {

    constructor(
      @Inject('Change') private readonly changeModel: Model<Change>,
      @Inject('Change') private readonly paginateChangeModel: PaginateModel<Change>,
      @Inject('Node') private readonly nodeModel: Model<Node>,
      @Inject('Tree') private readonly treeModel: Model<Tree>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(change: CreateChangeDTO): Promise<Change> {

      //TODO should I verify here if the user is actually a collaborator and is authorized to make this change?

      const NewChange = new this.changeModel({
        line_ids: change.line_ids,
        user_id: change.user_id,
        node_id: change.node_id,
        commit_id: change.commit_id,
        type: change.type,
        data: change.data
      });
      return await NewChange.save();
    }

    async Delete(id): Promise<Change> {
      return await this.changeModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Change> {
      return await this.changeModel.findById(id);
    }

    async OrderedMainlineChanges(tree_id): Promise<Change[]> {

      const tree:Tree = await this.treeModel.findById(tree_id);

      const node_ids:Schema.Types.ObjectId[] = (await this.nodeModel.find({
        tree_id: tree._id,
        isInMainline: true
      }))
        .sort((a, b) => a.mlBaseIndex - b.mlBaseIndex)
        .map(doc => doc._id);

      let orderedMainlineChanges:Change[] = [];

      for(let node_id of node_ids){
        const nodeChanges:Change[] = await this.changeModel.find({
          node_id: node_id
        });
        orderedMainlineChanges.push(...nodeChanges);
      }

      return orderedMainlineChanges;
    }

    async List(dto:ListChangeDTO): Promise<PaginateResult<Change>> {

      let query:any = {};

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateChangeModel.paginate(query, options);

    }
}
