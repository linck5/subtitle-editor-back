import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Branch } from './branch.schema';
import { CreateBranchDTO, UpdateBranchDTO, ListBranchDTO } from './branch.dtos';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class BranchService {

    constructor(
      @InjectModel('Branch') private readonly branchModel: Model<Branch>,
      @InjectModel('Branch') private readonly paginateBranchModel: PaginateModel<Branch>
    ) { }

    onModuleInit() { }

    async Create(branch: CreateBranchDTO): Promise<Branch> {
      const NewBranch = new this.branchModel({
        name: branch.name,
        description: branch.description,
        duration: branch.duration,
        url: branch.url
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

      let options:PaginateOptions = {
        sort: {}
      };

      //the pagination library won't work assigning undefined to
      //PaginateOptions feilds, so conditionally assign them:
      if(dto.limit) options.limit = dto.limit;
      if(dto.offset) options.offset = dto.offset;
      if(dto.page) options.page = dto.page;
      if(dto.orderby && dto.orderby.length > 0){
        dto.orderby.map(orderByParam => {
          options.sort[orderByParam.field] = orderByParam.desc? -1:1
        });
      };

      return await this.paginateBranchModel.paginate(query, options);

    }

    async FindByName(branch_name: string): Promise<Branch> {
      return await this.branchModel.findOne({ name: branch_name });
    }
}
