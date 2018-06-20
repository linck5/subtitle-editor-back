import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { CommitService } from './commit.service';
import { CreateCommitDTO, UpdateCommitDTO, ListCommitDTO, commitOrderByParams,
GetCommitByNameDTO } from './commit.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class CommitController {
  constructor(private readonly commitService: CommitService) { }


  @Get('/commits')
  async List( @Query(new OrderByPipe(commitOrderByParams)) query:ListCommitDTO ) {
    return await this.commitService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/commit/:commit_id')
  async GetById( @Param('commit_id') commit_id) {
    return await this.commitService.GetById(commit_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/commit')
  async GetByName( @Query() query:GetCommitByNameDTO) {
    return await this.commitService.FindByName(query.name)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/commits')
  async Create( @Body() addCommitDTO:CreateCommitDTO) {
    return await this.commitService.Create(addCommitDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/commit/:commit_id')
  async Update( @Param('commit_id') commit_id, @Body() updateCommitDTO:UpdateCommitDTO) {
    return await this.commitService.Update(commit_id, updateCommitDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/commit/:commit_id')
  async Delete( @Param('commit_id') commit_id) {
    return await this.commitService.Delete(commit_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
