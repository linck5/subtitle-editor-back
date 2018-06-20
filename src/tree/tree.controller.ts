import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { TreeService } from './tree.service';
import { CreateTreeDTO, UpdateTreeDTO, ListTreeDTO, treeOrderByParams } from './tree.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class TreeController {
  constructor(private readonly treeService: TreeService) { }


  @Get('/trees')
  async List( @Query(new OrderByPipe(treeOrderByParams)) query:ListTreeDTO ) {
    return await this.treeService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/tree/:tree_id')
  async GetById( @Param('tree_id') tree_id) {
    return await this.treeService.GetById(tree_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/trees')
  async Create( @Body() addTreeDTO:CreateTreeDTO) {
    return await this.treeService.Create(addTreeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/tree/:tree_id')
  async Update( @Param('tree_id') tree_id, @Body() updateTreeDTO:UpdateTreeDTO) {
    return await this.treeService.Update(tree_id, updateTreeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/tree/:tree_id')
  async Delete( @Param('tree_id') tree_id) {
    return await this.treeService.Delete(tree_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
