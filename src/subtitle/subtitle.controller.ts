import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { CreateSubtitleDTO, UpdateSubtitleDTO, ListSubtitleDTO, subtitleOrderByParams,
GetSubtitleByNameDTO } from './subtitle.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) { }


  @Get('/subtitles')
  async List( @Query(new OrderByPipe(subtitleOrderByParams)) query:ListSubtitleDTO ) {
    return await this.subtitleService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/subtitle/:subtitle_id')
  async GetById( @Param('subtitle_id') subtitle_id) {
    return await this.subtitleService.GetById(subtitle_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/subtitle')
  async GetByName( @Query() query:GetSubtitleByNameDTO) {
    return await this.subtitleService.FindByName(query.name)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/subtitles')
  async Create( @Body() addSubtitleDTO:CreateSubtitleDTO) {
    return await this.subtitleService.Create(addSubtitleDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/subtitle/:subtitle_id')
  async Update( @Param('subtitle_id') subtitle_id, @Body() updateSubtitleDTO:UpdateSubtitleDTO) {
    return await this.subtitleService.Update(subtitle_id, updateSubtitleDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/subtitle/:subtitle_id')
  async Delete( @Param('subtitle_id') subtitle_id) {
    return await this.subtitleService.Delete(subtitle_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
