import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { ChangeService } from './change.service';
import { AssChangeService } from './ass/assChange.service';
import { CreateChangeDTO, ListChangeDTO, changeOrderByParams} from './change.dtos';
import { CreateAssChangeDTO} from './ass/change.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class ChangeController {
  constructor(
    private readonly changeService: ChangeService,
    private readonly assChangeService: AssChangeService
  ) { }


  @Get('/changes')
  async List( @Query(new OrderByPipe(changeOrderByParams)) query:ListChangeDTO ) {
    return await this.changeService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/changes/mainline/:tree_id')
  async ListOrderedMainlineChanges( @Param('tree_id') tree_id) {
    return await this.changeService.OrderedMainlineChanges(tree_id)
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


  @Post('/changes')
  async Create( @Body() createChangeDTO:CreateChangeDTO) {
    return await this.assChangeService.Create(createChangeDTO)
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
