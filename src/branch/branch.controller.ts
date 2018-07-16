import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body,
  HttpException } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDTO, UpdateBranchDTO, ListBranchDTO, branchOrderByParams } from './branch.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class BranchController {
  constructor(private readonly branchService: BranchService) { }


  @Get('/branches')
  async List( @Query(new OrderByPipe(branchOrderByParams)) query:ListBranchDTO ) {
    return await this.branchService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/branch/:branch_id')
  async GetById( @Param('branch_id') branch_id) {
    return await this.branchService.GetById(branch_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/branches')
  async Create( @Body() createBranchDTO:CreateBranchDTO ) {
    return await this.branchService.Create(createBranchDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/branch/:branch_id')
  async Update( @Param('branch_id') branch_id, @Body() updateBranchDTO:UpdateBranchDTO) {
    return await this.branchService.Update(branch_id, updateBranchDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/branch/:branch_id/collaborators/add/:collaborator_id')
  async AddCollaborator(
    @Param('branch_id') branch_id,
    @Param('collaborator_id') collaborator_id)
    {
    return null; //TODO
  }

  @Patch('/branch/:branch_id/collaborators/remove/:collaborator_id')
  async RemoveCollaborator(
    @Param('branch_id') branch_id,
    @Param('collaborator_id') collaborator_id)
    {
    return null; //TODO
  }


}
