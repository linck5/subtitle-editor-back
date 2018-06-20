import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { ChangeService } from './change.service';
import { CreateChangeDTO, UpdateChangeDTO, ListChangeDTO, changeOrderByParams,
GetChangeByNameDTO } from './change.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class ChangeController {
  constructor(private readonly changeService: ChangeService) { }


  @Get('/changes')
  async List( @Query(new OrderByPipe(changeOrderByParams)) query:ListChangeDTO ) {
    return await this.changeService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/change/:change_id')
  async GetById( @Param('change_id') change_id) {
    return await this.changeService.GetById(change_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/change')
  async GetByName( @Query() query:GetChangeByNameDTO) {
    return await this.changeService.FindByName(query.name)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/changes')
  async Create( @Body() addChangeDTO:CreateChangeDTO) {
    return await this.changeService.Create(addChangeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/change/:change_id')
  async Update( @Param('change_id') change_id, @Body() updateChangeDTO:UpdateChangeDTO) {
    return await this.changeService.Update(change_id, updateChangeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/change/:change_id')
  async Delete( @Param('change_id') change_id) {
    return await this.changeService.Delete(change_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
