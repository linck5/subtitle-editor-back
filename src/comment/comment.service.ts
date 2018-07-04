import { Model, PaginateModel, PaginateResult,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Comment } from './comment.schema';
import { CreateCommentDTO, UpdateCommentDTO, ListCommentDTO } from './comment.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from '../common/pagination.service';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class CommentService {

    constructor(
      @InjectModel('Comment') private readonly commentModel: Model<Comment>,
      @InjectModel('Comment') private readonly paginateCommentModel: PaginateModel<Comment>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async FindAll(): Promise<Comment[]> {
      return await this.commentModel.find();
    }

    async Create(comment: CreateCommentDTO): Promise<Comment> {

      let commentObj:any = {
        author: comment.author,
        content: comment.content,
        [comment.type]: null
      }

      switch(comment.type){
        case 'change': commentObj.change = comment.change; break;
        case 'commit': commentObj.commit = comment.commit; break;
      }

      commentObj[comment.type] = comment[comment.type];

      const NewComment = new this.commentModel(commentObj);
      return await NewComment.save();
    }

    async Update(id, comment: UpdateCommentDTO): Promise<Comment> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.commentModel.findByIdAndUpdate(id, comment, options);
    }

    async Delete(id): Promise<Comment> {
      return await this.commentModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<Comment> {
      return await this.commentModel.findById(id);
    }

    async List(dto:ListCommentDTO): Promise<PaginateResult<Comment>> {

      let query:any = {};

      if(dto.type != undefined){
        switch(dto.type){
          case 'change': query.commit = null; break;
          case 'commit': query.change = null; break;
        }
      }

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateCommentModel.paginate(query, options);

    }

    async FindByName(commentname: string): Promise<Comment> {
      return await this.commentModel.findOne({ commentname: commentname });
    }
}
