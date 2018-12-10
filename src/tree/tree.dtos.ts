
import { IsString, IsInt, IsDefined, IsMongoId, IsBoolean, IsDate, IsArray
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';


export class CreateTreeDTO {

  @IsDefined()
  @IsString()
  readonly language: string;

  @IsString()
  readonly description: string;

  @IsDefined()
  @IsMongoId()
  readonly video_id: Schema.Types.ObjectId;

  @IsDefined()
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

  @IsArray()
  readonly ids: number[];

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
