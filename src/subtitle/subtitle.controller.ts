import { Controller, Post, HttpStatus, Param, Get, Body, Delete,
  HttpException } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { CreateSubtitleDTO, CreateSubtitleFromASSFileDTO} from './subtitle.dtos';

@Controller()
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) { }


  @Get('/subtitle/:subtitle_id')
  async GetById( @Param('subtitle_id') subtitle_id) {
    return await this.subtitleService.GetById(subtitle_id)
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

  @Post('/subtitles/fromAss')
  async CreateFromASSFile( @Body() dto:CreateSubtitleFromASSFileDTO) {
    return await this.subtitleService.CreateFromASSFile(dto.assstring)
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
