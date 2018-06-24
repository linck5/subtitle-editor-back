import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Tree } from './tree.schema';
import { CreateTreeDTO, UpdateTreeDTO, ListTreeDTO } from './tree.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class TreeService {

    constructor(
      @InjectModel('Tree') private readonly treeModel: Model<Tree>,
      @InjectModel('Tree') private readonly paginateTreeModel: PaginateModel<Tree>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }


    readonly language: string;


    async Create(tree: CreateTreeDTO): Promise<Tree> {
      const NewTree = new this.treeModel({
        language: tree.language,
        description: tree.description,
        video_id: tree.video_id,
        subtitle_id: tree.subtitle_id
      });
      return await NewTree.save();
    }

    async Update(id, tree: UpdateTreeDTO): Promise<Tree> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.treeModel.findByIdAndUpdate(id, tree, options);
    }

    async Delete(id): Promise<Tree> {
      return await this.treeModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Tree> {
      return await this.treeModel.findById(id);
    }


    async List(dto:ListTreeDTO): Promise<PaginateResult<Tree>> {

      let query:any = {};

  const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateTreeModel.paginate(query, options);

    }

    async FindByName(tree_name: string): Promise<Tree> {
      return await this.treeModel.findOne({ name: tree_name });
    }
}
