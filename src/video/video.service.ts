import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Video } from './video.schema';
import { CreateVideoDTO, UpdateVideoDTO, ListVideoDTO } from './video.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class VideoService {

    constructor(
      @InjectModel('Video') private readonly videoModel: Model<Video>,
      @InjectModel('Video') private readonly paginateVideoModel: PaginateModel<Video>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async Create(video: CreateVideoDTO): Promise<Video> {
      const NewVideo = new this.videoModel({
        name: video.name,
        description: video.description,
        duration: video.duration,
        url: video.url
      });
      return await NewVideo.save();
    }

    async Update(id, video: UpdateVideoDTO): Promise<Video> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.videoModel.findByIdAndUpdate(id, video, options);
    }

    async Delete(id): Promise<Video> {
      return await this.videoModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Video> {
      return await this.videoModel.findById(id);
    }


    async List(dto:ListVideoDTO): Promise<PaginateResult<Video>> {

      let query:any = {};

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateVideoModel.paginate(query, options);

    }

    async FindByName(video_name: string): Promise<Video> {
      return await this.videoModel.findOne({ name: video_name });
    }
}
