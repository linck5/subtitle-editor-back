
import { IsString, IsInt, IsDateString, IsMongoId, ValidateNested, IsNumber,
  IsDefined, Matches } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';
import { Type } from 'class-transformer';




export class CreateChangeDTO {

  @IsDefined()
  @IsMongoId()
  readonly user_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly commit_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly node_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  @Matches(/(?:CREATE)|(?:EDIT)|(?:TIME_SHIFT)|(?:DELETE)/)
  readonly type: string;

}


export class RebasedChangeDTO {

  @IsDefined()
  @IsMongoId()
  readonly user_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly commit_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly node_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  @Matches(/(?:CREATE)|(?:EDIT)|(?:TIME_SHIFT)|(?:DELETE)/)
  readonly type: string;

  @IsDefined()
  @IsDateString()
  readonly creation: string;

}

export class ListChangeDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const changeOrderByParams =
['type', 'user', 'commit'];

export class ListOrderedMainlineChanges {

  @IsMongoId()
  readonly tree_id: Schema.Types.ObjectId;;
}
