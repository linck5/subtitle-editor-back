import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelUpdateOptions, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Branch } from './branch.schema';
import { Tree } from '../tree/tree.schema';
import { Commit } from '../commit/commit.schema';
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
      @InjectModel('Commit') private readonly commitModel: Model<Commit>,
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Collaborator') private readonly collaboratorModel: Model<Collaborator>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(dto:CreateBranchDTO): Promise<Branch> {


      const Tree:Tree = await this.treeModel.findById(dto.tree_id);
      const Creator:User = await this.userModel.findById(dto.creator_id);

      // create the collaborator document for the creator
      const CreatorAsCollaborator = new this.collaboratorModel({
        user_id: Creator._id,
        creator: true,
        admin: true
      });

      // create the branch itself
      const NewBranch = new this.branchModel({
        collaborators: [CreatorAsCollaborator],
        status: "UNMODIFIED",
        deleted: false,
        tree_id: dto.tree_id,
        // any new branch is created on top of the mainline,
        // so the base commits is the mainline in the current state of
        // this branch's creation
        baseCommit_ids: Tree.mainline
      });

      // put a reference to the branch in the user
      Creator.branch_ids.push(NewBranch._id);
      await Creator.save();

      return await NewBranch.save();
    }

    async Update(id, updateDto: UpdateBranchDTO): Promise<Branch> {
      const options:ModelUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }

      const branch:Branch = await this.branchModel.findById(id);

      if(updateDto.status == "APPROVED"){

        let tree:Tree = await this.treeModel.findById(branch.tree_id);

        const lastBaseCommit:Commit =
          await this.commitModel.findById(branch.baseCommit_ids[tree.mainline.length -1])

        const lastBaseBranch:Branch =
          await this.branchModel.findById(lastBaseCommit.branch_id);

        if(
            lastBaseBranch.status == "APPROVED" ||
            lastBaseBranch.status == "MERGED" ||
            lastBaseBranch.status == "ROOT"
        ){
          const branchCommit_ids:Schema.Types.ObjectId[] =
            (await this.commitModel.find({branch_id: id}))
            .map(commit => commit._id);


          tree.mainline.push(...branchCommit_ids);
          await tree.save();
          return await branch.update(updateDto, options);
        }
        else{
          //TODO merge
          return null;
        }

      }


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
