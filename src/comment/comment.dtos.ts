
import { IsString, IsInt, ValidateIf, IsMongoId, IsIn, IsDefined
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';

export class CreateCommentDTO {

  @IsDefined()
  @IsIn(['change', 'commit'])
  @IsString()
  readonly type: string;

  @ValidateIf(o => o.type === 'change')
  @IsDefined()
  @IsMongoId()
  readonly change_id: Schema.Types.ObjectId;

  @ValidateIf(o => o.type === 'commit')
  @IsDefined()
  @IsMongoId()
  readonly commit_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly author_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  readonly content: string;
}

export class UpdateCommentDTO {

  @IsString()
  readonly content: string;
}

export class ListCommentDTO {

  @IsIn(['change', 'commit'])
  @IsString()
  readonly type: string;

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const commentOrderByParams =
['author']
