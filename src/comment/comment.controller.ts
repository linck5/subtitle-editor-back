import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body, Delete,
  HttpException } from '@nestjs/common';
import { CommentService } from '../comment/comment.service';
import { CreateCommentDTO, UpdateCommentDTO, ListCommentDTO, commentOrderByParams
} from './comment.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';


@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }


  @Get('/comments')
  async List( @Query(new OrderByPipe(commentOrderByParams)) query:ListCommentDTO ) {
    return await this.commentService.List(query)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/comment/:comment_id')
  async GetById( @Param('comment_id') comment_id) {
    return await this.commentService.GetById(comment_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/comments')
  async Create( @Body() addCommentDTO:CreateCommentDTO) {
    return await this.commentService.Create(addCommentDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/comment/:comment_id')
  async Update( @Param('comment_id') comment_id, @Body() updateCommentDTO:UpdateCommentDTO) {
    return await this.commentService.Update(comment_id, updateCommentDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

}
