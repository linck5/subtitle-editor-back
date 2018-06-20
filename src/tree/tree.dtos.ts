
import { IsString, IsInt, IsUrl, IsMongoId, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';


export class CreateTreeDTO {

  @IsString()
  readonly language: string;

  @IsString()
  readonly description: string;

  @IsMongoId()
  readonly video_id: Schema.Types.ObjectId;

  @IsMongoId()
  readonly subtitle_id: Schema.Types.ObjectId;
}

export class UpdateTreeDTO {

  @IsMongoId()
  readonly video_id: Schema.Types.ObjectId;

  @IsMongoId({each: true})
  readonly mainline: Schema.Types.ObjectId[];
}

export class ListTreeDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const treeOrderByParams =
['creation']
