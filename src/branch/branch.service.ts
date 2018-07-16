import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Branch } from './branch.schema';
import { Tree } from '../tree/tree.schema';
import { User } from '../user/user.schema';
import { Collaborator } from './collaborator/collaborator.schema';
import { CreateBranchDTO, UpdateBranchDTO, ListBranchDTO } from './branch.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class BranchService {

    constructor(
      @InjectModel('Branch') private readonly branchModel: Model<Branch>,
      @InjectModel('Branch') private readonly paginateBranchModel: PaginateModel<Branch>,
      @InjectModel('Tree') private readonly treeModel: Model<Tree>,
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Collaborator') private readonly collaboratorModel: Model<Collaborator>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(dto:CreateBranchDTO): Promise<Branch> {


      const Tree:Tree = await this.treeModel.findById(dto.tree);
      const Creator:User = await this.userModel.findById(dto.creator);

      // create the collaborator document for the creator
      const CreatorAsCollaborator = new this.collaboratorModel({
        user: Creator._id,
        creator: true,
        admin: true
      });

      // create the branch itself
      const NewBranch = new this.branchModel({
        collaborators: [CreatorAsCollaborator],
        status: "UNMODIFIED",
        deleted: false,
        // any new branch is created on top of the mainline,
        // so the base commits is the mainline in the current state of
        // this branch's creation
        baseCommits: Tree.mainline
      });

      // put a reference to the branch in the user
      Creator.branches.push(NewBranch._id);
      await Creator.save();

      return await NewBranch.save();
    }

    async Update(id, branch: UpdateBranchDTO): Promise<Branch> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.branchModel.findByIdAndUpdate(id, branch, options);
    }

    async Delete(id): Promise<Branch> {
      return await this.branchModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Branch> {
      return await this.branchModel.findById(id);
    }


    async List(dto:ListBranchDTO): Promise<PaginateResult<Branch>> {

      let query:any = {};

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateBranchModel.paginate(query, options);

    }

}
