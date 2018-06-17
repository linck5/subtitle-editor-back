import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDTO, UpdateVideoDTO, ListVideoDTO, videoOrderByParams,
GetVideoByNameDTO } from './video.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) { }


  @Get('/videos')
  async List( @Query(new OrderByPipe(videoOrderByParams)) query:ListVideoDTO ) {
    return await this.videoService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/video/:video_id')
  async GetById( @Param('video_id') video_id) {
    return await this.videoService.GetById(video_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/video')
  async GetByName( @Query() query:GetVideoByNameDTO) {
    return await this.videoService.FindByName(query.name)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/videos')
  async Create( @Body() addVideoDTO:CreateVideoDTO) {
    return await this.videoService.Create(addVideoDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/video/:video_id')
  async Update( @Param('video_id') video_id, @Body() updateVideoDTO:UpdateVideoDTO) {
    return await this.videoService.Update(video_id, updateVideoDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/video/:video_id')
  async Delete( @Param('video_id') video_id) {
    return await this.videoService.Delete(video_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
