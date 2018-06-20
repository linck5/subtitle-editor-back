import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDTO, UpdateBranchDTO, ListBranchDTO, branchOrderByParams,
GetBranchByNameDTO } from './branch.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class BranchController {
  constructor(private readonly branchService: BranchService) { }


  @Get('/branchs')
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

  @Get('/branch')
  async GetByName( @Query() query:GetBranchByNameDTO) {
    return await this.branchService.FindByName(query.name)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/branchs')
  async Create( @Body() addBranchDTO:CreateBranchDTO) {
    return await this.branchService.Create(addBranchDTO)
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

  @Delete('/branch/:branch_id')
  async Delete( @Param('branch_id') branch_id) {
    return await this.branchService.Delete(branch_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
