import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Branch } from './branch.schema';
import { UpdateBranchDTO, ListBranchDTO } from './branch.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class BranchService {

    constructor(
      @InjectModel('Branch') private readonly branchModel: Model<Branch>,
      @InjectModel('Branch') private readonly paginateBranchModel: PaginateModel<Branch>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(): Promise<Branch> {

      //TODO set base commits


      //TODO put a reference to the tree in the user
      //TODO add a collaborator to the branch referencing the user

      const NewBranch = new this.branchModel({
        collaborators: [],
        status: "UNMODIFIED",
        deleted: false
      });
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
